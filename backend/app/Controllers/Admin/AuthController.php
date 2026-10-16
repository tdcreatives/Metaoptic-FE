<?php
declare(strict_types=1);

namespace App\Controllers\Admin;

use App\Controllers\BaseController;
use CodeIgniter\HTTP\RedirectResponse;
use CodeIgniter\HTTP\ResponseInterface;
use Config\Admin;

class AuthController extends BaseController
{
    public function loginForm(): string
    {
        return view('admin/login', ['title' => 'Admin login']);
    }

    public function login(): RedirectResponse
    {
        // ponytail: md5 avoids CI4 reserved cache chars (IPv6 "::1" has ":")
        $key = md5('admin_login:' . $this->request->getIPAddress());
        $fails = (int) cache()->get($key);
        if ($fails >= 5) {
            return redirect()->to('/admin/login')->with('error', 'Too many attempts');
        }

        $username = (string) $this->request->getPost('username');
        $password = (string) $this->request->getPost('password');
        $admin = config(Admin::class);

        $userOk = hash_equals($admin->username(), $username);
        $passOk = $admin->passwordHash() !== '' && password_verify($password, $admin->passwordHash());
        if (!$userOk || !$passOk) {
            cache()->save($key, $fails + 1, 900);

            return redirect()->to('/admin/login')->with('error', 'Invalid credentials');
        }

        cache()->delete($key);
        session()->regenerate(true);
        session()->set('admin', true);
        service('auditLogger')->write('login', null, null, []);

        return redirect()->to('/admin');
    }

    public function logout(): ResponseInterface
    {
        session()->remove('admin');
        session()->destroy();

        return redirect()->to('/admin/login');
    }
}
