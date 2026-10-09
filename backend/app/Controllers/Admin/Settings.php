<?php
declare(strict_types=1);

namespace App\Controllers\Admin;

use App\Controllers\BaseController;
use App\Models\AdminRecipientModel;
use CodeIgniter\Database\Exceptions\DatabaseException;
use CodeIgniter\HTTP\RedirectResponse;

class Settings extends BaseController
{
    public function recipients(): string
    {
        return view('admin/settings/recipients', [
            'title' => 'Digest recipients',
            'recipients' => model(AdminRecipientModel::class)->orderBy('id', 'DESC')->findAll(),
        ]);
    }

    public function updateRecipients(): RedirectResponse
    {
        $action = (string) $this->request->getPost('action');
        if ($action === 'deactivate') {
            return $this->deactivate();
        }

        return $this->add();
    }

    private function add(): RedirectResponse
    {
        $email = trim((string) $this->request->getPost('email'));
        if (filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
            return redirect()->to('/admin/settings/recipients')->with('error', 'invalid_email');
        }

        $model = model(AdminRecipientModel::class);
        $existing = $model->where('email', $email)->first();
        if ($existing !== null) {
            return $this->existingEmail($existing);
        }

        try {
            $id = (int) $model->insert([
                'email' => $email,
                'active' => 1,
            ], true);
        } catch (DatabaseException) {
            $existing = $model->where('email', $email)->first();
            if ($existing !== null) {
                return $this->existingEmail($existing);
            }

            return redirect()->to('/admin/settings/recipients')->with('error', 'Could not add recipient');
        }

        service('auditLogger')->write('settings_recipients', 'admin_recipient', (string) $id, ['action' => 'add']);

        return redirect()->to('/admin/settings/recipients')->with('message', 'Recipient added');
    }

    /** @param array<string, mixed> $row */
    private function existingEmail(array $row): RedirectResponse
    {
        if ((int) $row['active'] === 0) {
            $id = (int) $row['id'];
            model(AdminRecipientModel::class)->update($id, ['active' => 1]);
            service('auditLogger')->write('settings_recipients', 'admin_recipient', (string) $id, ['action' => 'reactivate']);

            return redirect()->to('/admin/settings/recipients')->with('message', 'Recipient reactivated');
        }

        return redirect()->to('/admin/settings/recipients')->with('error', 'That email is already added');
    }

    private function deactivate(): RedirectResponse
    {
        $id = (int) $this->request->getPost('id');
        $row = model(AdminRecipientModel::class)->find($id);
        if ($row === null) {
            return redirect()->to('/admin/settings/recipients')->with('error', 'not_found');
        }

        model(AdminRecipientModel::class)->update($id, ['active' => 0]);
        service('auditLogger')->write('settings_recipients', 'admin_recipient', (string) $id, ['action' => 'deactivate']);

        return redirect()->to('/admin/settings/recipients')->with('message', 'Deactivated');
    }
}
