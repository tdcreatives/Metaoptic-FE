<?php
declare(strict_types=1);

namespace Config;

use CodeIgniter\Config\BaseConfig;

class Admin extends BaseConfig
{
    public string $username = '';
    public string $passwordHash = '';
    /** Public FE origin for Preview redirects (e.g. http://localhost:3000). */
    public string $fePublicOrigin = '';
    /** HMAC secret for announcement preview tokens; falls back to email.unsubscribeSecret. */
    public string $previewSecret = '';

    public function __construct()
    {
        parent::__construct();
        $this->username = (string) env('admin.username', '');
        $this->passwordHash = (string) env('admin.passwordHash', '');
        $this->fePublicOrigin = rtrim((string) env('admin.fePublicOrigin', ''), '/');
        $this->previewSecret = (string) env('admin.previewSecret', '');

        // ponytail: local Preview without extra env. Ceiling: prod must set admin.fePublicOrigin (or email.publicSiteURL).
        if ($this->fePublicOrigin === '' && ENVIRONMENT === 'development') {
            $this->fePublicOrigin = 'http://localhost:3000';
        }
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
