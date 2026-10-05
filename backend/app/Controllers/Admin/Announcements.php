<?php
declare(strict_types=1);

namespace App\Controllers\Admin;

use App\Controllers\BaseController;
use App\Libraries\Admin\AlertDraftFromAnnouncementService;
use App\Libraries\Admin\AnnouncementDeleteGuard;
use App\Libraries\Admin\AnnouncementPreviewToken;
use App\Libraries\Admin\ArchiveService;
use App\Libraries\Admin\ManualAnnouncementService;
use App\Libraries\Admin\PublishService;
use App\Libraries\Email\CategoryCatalog;
use App\Libraries\Sgx\AnnouncementDetailHydrator;
use App\Models\AnnouncementModel;
use CodeIgniter\Exceptions\PageNotFoundException;
use CodeIgniter\HTTP\RedirectResponse;
use DomainException;
use InvalidArgumentException;

class Announcements extends BaseController
{
    public function index(): string
    {
        $model = model(AnnouncementModel::class);
        $state = (string) $this->request->getGet('state');
        if ($state !== '') {
            $model->where('state', $state);
        }

        $categories = CategoryCatalog::all();
        $category = trim((string) $this->request->getGet('category'));
        // ponytail: ignore unknown category query instead of 400
        if ($category !== '' && in_array($category, $categories, true)) {
            $model->where('category', $category);
        } else {
            $category = '';
        }

        $needsReview = (string) $this->request->getGet('needs_review') === '1';
        if ($needsReview) {
            $model->where('needs_review', 1);
        }

        return view('admin/announcements/index', [
            'title' => 'Announcements',
            'announcements' => $model->orderBy('filed_at', 'DESC')->findAll(),
            'state' => $state,
            'category' => $category,
            'categories' => $categories,
            'needs_review' => $needsReview,
        ]);
    }

    public function createForm(): string
    {
        return view('admin/announcements/form', [
            'title' => 'New announcement',
        ]);
    }

    public function create(): RedirectResponse
    {
        $post = $this->announcementPost();
        // Create never honors posted state — always pending_review
        unset($post['state']);

        if (! $this->validateData($post, [
            'title' => 'required',
            'category' => 'required',
            'filed_at' => 'required',
        ])) {
            return redirect()->to('/admin/announcements/new')
                ->withInput()
                ->with('error', implode(' ', $this->validator->getErrors()));
        }

        try {
            $id = (new ManualAnnouncementService())->create($post);
        } catch (InvalidArgumentException $e) {
            return redirect()->to('/admin/announcements/new')
                ->withInput()
                ->with('error', $e->getMessage());
        }

        return redirect()->to('/admin/announcements/' . $id)->with('message', 'Created');
    }

    public function show(int $id): string
    {
        $row = AnnouncementDetailHydrator::hydrate($this->findOr404($id));

        $decoded = json_decode((string) $row['source_payload'], true);
        $pretty = is_array($decoded)
            ? (string) json_encode($decoded, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES)
            : (string) $row['source_payload'];

        return view('admin/announcements/show', [
            'title' => $row['title'],
            'row' => $row,
            'attachments' => is_array($row['_attachments'] ?? null) ? $row['_attachments'] : [],
            'sourcePretty' => $pretty,
            'offerAlert' => $this->request->getGet('offer_alert') === '1'
                && ($row['state'] ?? '') === 'published',
            'canPreview' => in_array((string) ($row['state'] ?? ''), ['pending_review', 'archived'], true),
        ]);
    }

    /** Mint a short-lived token and open the real FE preview page. */
    public function preview(int $id): RedirectResponse
    {
        $row = $this->findOr404($id);
        $state = (string) ($row['state'] ?? '');
        if (! in_array($state, ['pending_review', 'archived'], true)) {
            return redirect()->to('/admin/announcements/' . $id)
                ->with('error', 'Preview is only available for pending or archived announcements. Published items are already live on the site.');
        }

        try {
            $tokens = AnnouncementPreviewToken::fromConfig();
            $url = $tokens->pageUrl($tokens->mint($id));
        } catch (InvalidArgumentException $e) {
            $hint = str_contains($e->getMessage(), 'fe_origin')
                ? 'Set admin.fePublicOrigin (or email.publicSiteURL) to your FE origin, e.g. http://localhost:3000.'
                : 'Set admin.previewSecret or email.unsubscribeSecret (min 32 chars).';

            return redirect()->to('/admin/announcements/' . $id)->with('error', 'Preview unavailable. ' . $hint);
        }

        return redirect()->to($url);
    }

    public function updateDetail(int $id): RedirectResponse
    {
        $this->findOr404($id);
        $post = $this->announcementPost();
        unset($post['state']);

        if (! $this->validateData($post, [
            'title' => 'required',
            'category' => 'required',
            'filed_at' => 'required',
        ])) {
            return redirect()->to('/admin/announcements/' . $id)
                ->withInput()
                ->with('error', implode(' ', $this->validator->getErrors()));
        }

        try {
            (new ManualAnnouncementService())->update($id, $post);
        } catch (InvalidArgumentException $e) {
            return redirect()->to('/admin/announcements/' . $id)
                ->withInput()
                ->with('error', $e->getMessage());
        }
        service('auditLogger')->write('detail_edit', 'announcement', (string) $id, []);

        return redirect()->to('/admin/announcements/' . $id)->with('message', 'Saved');
    }

    public function updateLayout(int $id): RedirectResponse
    {
        $this->findOr404($id);
        $update = [];
        foreach (['title_btn', 'title_btn_sm', 'title_banner'] as $field) {
            $val = $this->request->getPost($field);
            $update[$field] = $this->sanitizeLayoutHtml($val === null ? null : (string) $val);
        }
        model(AnnouncementModel::class)->update($id, $update);
        service('auditLogger')->write('layout_edit', 'announcement', (string) $id, []);

        return redirect()->to('/admin/announcements/' . $id)->with('message', 'Saved');
    }

    public function updateSummary(int $id): RedirectResponse
    {
        $this->findOr404($id);
        $data = $this->request->getPost(['summary', 'email_subject', 'email_intro']);
        model(AnnouncementModel::class)->update($id, [
            'summary' => $data['summary'] ?? '',
            'email_subject' => $data['email_subject'] ?: null,
            'email_intro' => $data['email_intro'] ?: null,
        ]);
        service('auditLogger')->write('summary_edit', 'announcement', (string) $id, []);

        return redirect()->to('/admin/announcements/' . $id)->with('message', 'Saved');
    }

    public function publish(int $id): RedirectResponse
    {
        $returnToList = $this->wantsListReturn();

        try {
            $changed = (new PublishService())->publish($id);
        } catch (DomainException $e) {
            if ($e->getMessage() === 'not_found') {
                throw PageNotFoundException::forPageNotFound();
            }

            return redirect()
                ->to($returnToList ? '/admin/announcements' : '/admin/announcements/' . $id)
                ->with('error', $e->getMessage());
        }

        if ($changed) {
            service('auditLogger')->write('publish', 'announcement', (string) $id, []);
        }

        if ($returnToList) {
            return redirect()->to('/admin/announcements')
                ->with('message', 'Published — it on process to be live on the public MOT website - it take arround 5-10 minutes.');
        }

        if ($changed) {
            return redirect()->to('/admin/announcements/' . $id . '?offer_alert=1')->with('message', 'Published');
        }

        return redirect()->to('/admin/announcements/' . $id)->with('message', 'Published');
    }

    public function createAlertDraft(int $id): RedirectResponse
    {
        $this->findOr404($id);
        try {
            $alertId = (new AlertDraftFromAnnouncementService())->createDraft($id);
        } catch (DomainException $e) {
            return redirect()->to('/admin/announcements/' . $id)->with('error', $e->getMessage());
        }
        service('auditLogger')->write('alert_draft', 'email_alert', (string) $alertId, [
            'announcement_id' => $id,
        ]);

        return redirect()->to('/admin/email-alerts/' . $alertId . '/edit');
    }

    public function archive(int $id): RedirectResponse
    {
        try {
            $changed = (new ArchiveService())->archive($id);
        } catch (DomainException $e) {
            if ($e->getMessage() === 'not_found') {
                throw PageNotFoundException::forPageNotFound();
            }

            return redirect()
                ->to($this->wantsListReturn() ? '/admin/announcements' : '/admin/announcements/' . $id)
                ->with('error', $e->getMessage());
        }

        if ($changed) {
            service('auditLogger')->write('archive', 'announcement', (string) $id, []);
        }

        if ($this->wantsListReturn()) {
            return redirect()->to('/admin/announcements')
                ->with('message', 'Archived — hidden from the public IR website.');
        }

        return redirect()->to('/admin/announcements/' . $id)->with('message', 'Archived');
    }

    private function wantsListReturn(): bool
    {
        return $this->request->getPost('return_to') === 'list'
            || $this->request->getGet('return_to') === 'list';
    }

    public function delete(int $id): RedirectResponse
    {
        $this->findOr404($id);
        $db = db_connect();
        $db->transBegin();
        try {
            (new AnnouncementDeleteGuard())->prepareForDelete($id);
            model(AnnouncementModel::class)->delete($id);
            $db->transCommit();
        } catch (DomainException $e) {
            $db->transRollback();

            return redirect()->to('/admin/announcements/' . $id)->with('error', $e->getMessage());
        } catch (\Throwable $e) {
            $db->transRollback();
            throw $e;
        }
        service('auditLogger')->write('delete', 'announcement', (string) $id, []);

        return redirect()->to('/admin/announcements')->with('message', 'Deleted');
    }

    /** @return array<string, mixed> */
    private function findOr404(int $id): array
    {
        $row = model(AnnouncementModel::class)->find($id);
        if ($row === null) {
            throw PageNotFoundException::forPageNotFound();
        }

        return $row;
    }

    /** @return array<string, mixed> */
    private function announcementPost(): array
    {
        $keys = array_merge(
            [
                'title', 'category', 'filed_at', 'source_url', 'summary', 'body_html', 'state',
                'attachment_name', 'attachment_url',
            ],
            ManualAnnouncementService::FE_SCALAR_FIELDS,
        );
        $post = $this->request->getPost($keys) ?? [];
        if (! is_array($post)) {
            $post = [];
        }
        // CI4 may omit empty array fields — keep keys so update replaces attachments
        if (! array_key_exists('attachment_name', $post)) {
            $post['attachment_name'] = $this->request->getPost('attachment_name') ?? [];
        }
        if (! array_key_exists('attachment_url', $post)) {
            $post['attachment_url'] = $this->request->getPost('attachment_url') ?? [];
        }

        $select = trim((string) ($this->request->getPost('category_select') ?? ''));
        $custom = trim((string) ($this->request->getPost('category_custom') ?? ''));
        if ($select === CategoryCatalog::customMarker()) {
            $post['category'] = $custom;
        } elseif ($select !== '') {
            $post['category'] = $select;
        }

        $category = trim((string) ($post['category'] ?? ''));
        if ($category !== '') {
            $post['category'] = $category;
            CategoryCatalog::remember($category);
        }

        return $post;
    }

    private function sanitizeLayoutHtml(?string $val): ?string
    {
        if ($val === null || $val === '') {
            return null;
        }
        $stripped = strip_tags($val, '<br>');

        return $stripped === '' ? null : $stripped;
    }
}
