<?php
declare(strict_types=1);

namespace Config;

use CodeIgniter\Config\BaseConfig;

class Admin extends BaseConfig
{
    public string $username = '';
    public string $passwordHash = '';

    public function __construct()
    {
        parent::__construct();
        $this->username = (string) env('admin.username', '');
        $this->passwordHash = (string) env('admin.passwordHash', '');
    }

    public function username(): string
    {
        return $this->username;
    }

    public function passwordHash(): string
    {
        return $this->passwordHash;
    }
}
