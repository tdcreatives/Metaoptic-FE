<?php
declare(strict_types=1);

namespace App\Controllers\Admin;

use App\Controllers\BaseController;
use App\Libraries\Admin\PublishService;
use App\Libraries\Admin\SendEmailGate;
use App\Models\AnnouncementModel;
use App\Models\EmailCampaignModel;
use CodeIgniter\Exceptions\PageNotFoundException;
use CodeIgniter\HTTP\RedirectResponse;
use DomainException;

class Announcements extends BaseController
{
    public function index(): string
    {
        $model = model(AnnouncementModel::class);
        $state = (string) $this->request->getGet('state');
        if ($state !== '') {
            $model->where('state', $state);
        }

        return view('admin/announcements/index', [
            'title' => 'Announcements',
            'announcements' => $model->orderBy('filed_at', 'DESC')->findAll(),
            'state' => $state,
        ]);
    }

    public function show(int $id): string
    {
        $row = $this->findOr404($id);

        $decoded = json_decode((string) $row['source_payload'], true);
        $pretty = is_array($decoded)
            ? (string) json_encode($decoded, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES)
            : (string) $row['source_payload'];

        return view('admin/announcements/show', [
            'title' => $row['title'],
            'row' => $row,
            'sourcePretty' => $pretty,
        ]);
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
        try {
            (new PublishService())->publish($id);
        } catch (DomainException $e) {
            if ($e->getMessage() === 'not_found') {
                throw PageNotFoundException::forPageNotFound();
            }

            return redirect()->to('/admin/announcements/' . $id)->with('error', $e->getMessage());
        }

        service('auditLogger')->write('publish', 'announcement', (string) $id, []);

        return redirect()->to('/admin/announcements/' . $id)->with('message', 'Published');
    }

    public function send(int $id): RedirectResponse
    {
        $row = $this->findOr404($id);

        try {
            $gate = new SendEmailGate(model(EmailCampaignModel::class));
            $gate->assertCanSend($row);
            $campaignId = $gate->queueCampaign($row);
        } catch (DomainException $e) {
            return redirect()->to('/admin/announcements/' . $id)->with('error', $e->getMessage());
        }

        service('auditLogger')->write('send', 'announcement', (string) $id, ['campaign_id' => $campaignId]);

        return redirect()->to('/admin/announcements/' . $id)->with('message', 'Email queued');
    }

    public function archive(int $id): RedirectResponse
    {
        $this->findOr404($id);
        model(AnnouncementModel::class)->update($id, ['state' => 'archived']);
        service('auditLogger')->write('archive', 'announcement', (string) $id, []);

        return redirect()->to('/admin/announcements/' . $id)->with('message', 'Archived');
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
}
