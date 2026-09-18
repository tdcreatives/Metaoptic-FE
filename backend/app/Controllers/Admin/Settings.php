<?php
declare(strict_types=1);

namespace App\Controllers\Admin;

use App\Controllers\BaseController;
use App\Models\AdminRecipientModel;
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

        $id = (int) model(AdminRecipientModel::class)->insert([
            'email' => $email,
            'active' => 1,
        ], true);
        service('auditLogger')->write('settings_recipients', 'admin_recipient', (string) $id, ['action' => 'add']);

        return redirect()->to('/admin/settings/recipients')->with('message', 'Recipient added');
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
