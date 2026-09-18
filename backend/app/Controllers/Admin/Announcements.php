<?php
declare(strict_types=1);

namespace App\Controllers\Admin;

use App\Controllers\BaseController;
use App\Models\AnnouncementModel;
use CodeIgniter\Exceptions\PageNotFoundException;
use CodeIgniter\HTTP\RedirectResponse;

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
        $row = model(AnnouncementModel::class)->find($id);
        if ($row === null) {
            throw PageNotFoundException::forPageNotFound();
        }

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
        $data = $this->request->getPost(['summary', 'email_subject', 'email_intro']);
        model(AnnouncementModel::class)->update($id, [
            'summary' => $data['summary'] ?? '',
            'email_subject' => $data['email_subject'] ?: null,
            'email_intro' => $data['email_intro'] ?: null,
        ]);
        service('auditLogger')->write('summary_edit', 'announcement', (string) $id, []);

        return redirect()->to('/admin/announcements/' . $id)->with('message', 'Saved');
    }
}
