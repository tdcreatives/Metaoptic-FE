<?php
declare(strict_types=1);

namespace Config;

use CodeIgniter\Config\BaseConfig;

class EmailAlerts extends BaseConfig
{
    public string $unsubscribeSecret = '';
    public string $publicSiteUrl = '';

    public function __construct()
    {
        parent::__construct();
        $this->unsubscribeSecret = (string) env('email.unsubscribeSecret', '');
        $this->publicSiteUrl = rtrim((string) env('email.publicSiteURL', ''), '/');
    }
}
