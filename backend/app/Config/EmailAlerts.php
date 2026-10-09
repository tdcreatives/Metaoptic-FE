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

        // ponytail: empty secret → UnsubscribeToken throws before any DB write while API still returns {ok:true}.
        // Ceiling: local/test only; production must set email.unsubscribeSecret (≥32 chars).
        if ($this->unsubscribeSecret === '' && in_array(ENVIRONMENT, ['development', 'testing'], true)) {
            $this->unsubscribeSecret = 'dev-only-unsubscribe-secret-min-32-chars!!';
        }
        if ($this->publicSiteUrl === '' && ENVIRONMENT === 'development') {
            $this->publicSiteUrl = 'http://localhost:4444';
        }
    }
}
