<?php
declare(strict_types=1);

namespace App\Controllers\Admin;

use App\Controllers\BaseController;
use App\Libraries\Email\AlertLifecycleService;
use App\Libraries\Email\AudienceResolver;
use App\Models\AnnouncementModel;
use App\Models\EmailAlertModel;
use App\Models\EmailDeliveryModel;
use CodeIgniter\Exceptions\PageNotFoundException;
use CodeIgniter\HTTP\RedirectResponse;
use DomainException;

class EmailAlerts extends BaseController
{
    public function index(): string
    {
        return view('admin/email_alerts/index', [
            'title' => 'Email Alerts',
            'alerts' => model(EmailAlertModel::class)->orderBy('id', 'DESC')->findAll(),
        ]);
    }

    public function createForm(): string
    {
        $pre = (int) $this->request->getGet('announcement_id');

        return $this->formView('New email alert', null, $pre > 0 ? [$pre] : []);
    }

    public function create(): RedirectResponse
    {
        $data = $this->postedCompose();
        if (trim($data['subject']) === '') {
            return redirect()->to('/admin/email-alerts/new')
                ->withInput()
                ->with('error', 'Subject is required');
        }

        try {
            $id = (new AlertLifecycleService())->saveDraft($data, $this->postedAnnouncementIds());
        } catch (DomainException $e) {
            return redirect()->to('/admin/email-alerts/new')
                ->withInput()
                ->with('error', $e->getMessage());
        }

        service('auditLogger')->write('create', 'email_alert', (string) $id, []);

        return redirect()->to('/admin/email-alerts/' . $id)->with('message', 'Draft saved');
    }

    public function show(int $id): string
    {
        $alert = $this->findOr404($id);
        $attaches = $this->attachRows($id);
        $live = $this->liveAnnouncementRows($attaches);
        $categories = $this->audienceCategories($alert, $live);
        $estimate = (new AudienceResolver())->estimateSubscriberCount($categories);
        $campaignId = isset($alert['campaign_id']) ? (int) $alert['campaign_id'] : 0;
        $metrics = $this->deliveryMetrics($campaignId > 0 ? $campaignId : null);
        $deliveriesTotal = 0;
        $deliveries = [];
        if ($campaignId > 0) {
            $deliveriesTotal = model(EmailDeliveryModel::class)
                ->where('campaign_id', $campaignId)
                ->countAllResults();
            $deliveries = model(EmailDeliveryModel::class)
                ->where('campaign_id', $campaignId)
                ->orderBy('id', 'ASC')
                ->findAll(200);
        }

        return view('admin/email_alerts/show', [
            'title' => (string) $alert['subject'],
            'alert' => $alert,
            'attaches' => $attaches,
            'categories' => $categories,
            'estimate' => $estimate,
            'metrics' => $metrics,
            'deliveries' => $deliveries,
            'deliveriesTotal' => $deliveriesTotal,
        ]);
    }

    public function editForm(int $id): string|RedirectResponse
    {
        $alert = $this->findOr404($id);
        if ($alert['status'] !== 'draft') {
            return redirect()->to('/admin/email-alerts/' . $id)->with('error', 'not_draft');
        }

        $selected = [];
        foreach ($this->attachRows($id) as $row) {
            $selected[] = (int) $row['announcement_id'];
        }

        return $this->formView('Edit email alert', $alert, $selected);
    }

    public function update(int $id): RedirectResponse
    {
        $this->findOr404($id);
        try {
            (new AlertLifecycleService())->updateDraft($id, $this->postedCompose(), $this->postedAnnouncementIds());
        } catch (DomainException $e) {
            if ($e->getMessage() === 'not_found') {
                throw PageNotFoundException::forPageNotFound();
            }

            return redirect()->to('/admin/email-alerts/' . $id . '/edit')->with('error', $e->getMessage());
        }

        service('auditLogger')->write('update', 'email_alert', (string) $id, []);

        return redirect()->to('/admin/email-alerts/' . $id)->with('message', 'Saved');
    }

    public function schedule(int $id): RedirectResponse
    {
        $this->findOr404($id);
        try {
            (new AlertLifecycleService())->schedule($id, $this->postedScheduledAt());
        } catch (DomainException $e) {
            return $this->redirectAlertError($id, $e);
        }

        service('auditLogger')->write('schedule', 'email_alert', (string) $id, []);

        return redirect()->to('/admin/email-alerts/' . $id)->with('message', 'Scheduled');
    }

    public function sendNow(int $id): RedirectResponse
    {
        $this->findOr404($id);
        try {
            (new AlertLifecycleService())->sendNow($id);
        } catch (DomainException $e) {
            return $this->redirectAlertError($id, $e);
        }

        service('auditLogger')->write('send_now', 'email_alert', (string) $id, []);

        return redirect()->to('/admin/email-alerts/' . $id)->with('message', 'Sent');
    }

    public function cancel(int $id): RedirectResponse
    {
        $this->findOr404($id);
        try {
            (new AlertLifecycleService())->cancelSchedule($id);
        } catch (DomainException $e) {
            return $this->redirectAlertError($id, $e);
        }

        service('auditLogger')->write('cancel', 'email_alert', (string) $id, []);

        return redirect()->to('/admin/email-alerts/' . $id)->with('message', 'Cancelled');
    }

    public function delete(int $id): RedirectResponse
    {
        $this->findOr404($id);
        try {
            (new AlertLifecycleService())->deleteDraft($id);
        } catch (DomainException $e) {
            return $this->redirectAlertError($id, $e);
        }

        service('auditLogger')->write('delete', 'email_alert', (string) $id, []);

        return redirect()->to('/admin/email-alerts')->with('message', 'Deleted');
    }

    /** @param list<int> $selectedIds */
    private function formView(string $title, ?array $alert, array $selectedIds): string
    {
        $published = model(AnnouncementModel::class)
            ->where('state', 'published')
            ->orderBy('filed_at', 'DESC')
            ->findAll();
        $selected = [];
        foreach ($published as $row) {
            if (in_array((int) $row['id'], $selectedIds, true)) {
                $selected[] = $row;
            }
        }
        $categories = (new AudienceResolver())->categoryUnion($selected);

        return view('admin/email_alerts/form', [
            'title' => $title,
            'alert' => $alert,
            'published' => $published,
            'selectedIds' => $selectedIds,
            'categories' => $categories,
            'estimate' => (new AudienceResolver())->estimateSubscriberCount($categories),
        ]);
    }

    /** @return array<string, mixed> */
    private function postedCompose(): array
    {
        $post = $this->request->getPost(['name', 'subject', 'intro', 'body_html']) ?? [];

        return [
            'name' => ($post['name'] ?? '') === '' ? null : $post['name'],
            'subject' => (string) ($post['subject'] ?? ''),
            'intro' => ($post['intro'] ?? '') === '' ? null : $post['intro'],
            'body_html' => (string) ($post['body_html'] ?? ''),
        ];
    }

    /** @return list<int> */
    private function postedAnnouncementIds(): array
    {
        $raw = $this->request->getPost('announcement_ids');
        if (! is_array($raw)) {
            return [];
        }
        $ids = [];
        foreach ($raw as $id) {
            $n = (int) $id;
            if ($n > 0) {
                $ids[] = $n;
            }
        }

        return $ids;
    }

    private function postedScheduledAt(): string
    {
        $raw = trim((string) $this->request->getPost('scheduled_at'));
        $raw = str_replace('T', ' ', $raw);
        if (preg_match('/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/', $raw) === 1) {
            $raw .= ':00';
        }

        return $raw;
    }

    /** @return array<string, mixed> */
    private function findOr404(int $id): array
    {
        $row = model(EmailAlertModel::class)->find($id);
        if (! is_array($row)) {
            throw PageNotFoundException::forPageNotFound();
        }

        return $row;
    }

    private function redirectAlertError(int $id, DomainException $e): RedirectResponse
    {
        if ($e->getMessage() === 'not_found') {
            throw PageNotFoundException::forPageNotFound();
        }

        return redirect()->to('/admin/email-alerts/' . $id)->with('error', $e->getMessage());
    }

    /** @return list<array<string, mixed>> */
    private function attachRows(int $alertId): array
    {
        return db_connect()->table('email_alert_announcements eaa')
            ->select('eaa.*, a.title, a.filed_at, a.source_url, a.category, a.state')
            ->join('announcements a', 'a.id = eaa.announcement_id', 'left')
            ->where('eaa.email_alert_id', $alertId)
            ->orderBy('eaa.sort_order', 'ASC')
            ->orderBy('eaa.id', 'ASC')
            ->get()
            ->getResultArray();
    }

    /**
     * @param list<array<string, mixed>> $attaches
     * @return list<array<string, mixed>>
     */
    private function liveAnnouncementRows(array $attaches): array
    {
        $rows = [];
        foreach ($attaches as $row) {
            $rows[] = [
                'category' => (string) ($row['snap_category'] ?: $row['category'] ?? ''),
            ];
        }

        return $rows;
    }

    /**
     * @param array<string, mixed> $alert
     * @param list<array<string, mixed>> $live
     * @return list<string>
     */
    private function audienceCategories(array $alert, array $live): array
    {
        $json = $alert['audience_categories_json'] ?? null;
        if (is_string($json) && $json !== '') {
            $decoded = json_decode($json, true);
            if (is_array($decoded)) {
                return array_values(array_map('strval', $decoded));
            }
        }

        return (new AudienceResolver())->categoryUnion($live);
    }

    /** @return array{queued: int, sent: int, failed: int} */
    private function deliveryMetrics(?int $campaignId): array
    {
        $empty = ['queued' => 0, 'sent' => 0, 'failed' => 0];
        if ($campaignId === null || $campaignId < 1) {
            return $empty;
        }

        $row = db_connect()->table('email_deliveries')
            ->select("
                SUM(status = 'queued') AS queued,
                SUM(status = 'sent') AS sent,
                SUM(status IN ('failed_temp', 'failed_perm')) AS failed
            ", false)
            ->where('campaign_id', $campaignId)
            ->get()
            ->getRowArray() ?? [];

        return [
            'queued' => (int) ($row['queued'] ?? 0),
            'sent' => (int) ($row['sent'] ?? 0),
            'failed' => (int) ($row['failed'] ?? 0),
        ];
    }
}
