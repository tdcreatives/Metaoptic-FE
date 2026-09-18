<?php
declare(strict_types=1);

namespace Config;

use CodeIgniter\Config\BaseConfig;

class Sgx extends BaseConfig
{
    public string $baseURL = '';
    public string $companyCode = '';
    public bool $backfill = false;
    /** @var list<string> */
    public array $corsOrigins = [];

    public function __construct()
    {
        parent::__construct();
        $this->baseURL = rtrim((string) env('sgx.baseURL', ''), '/');
        $this->companyCode = (string) env('sgx.companyCode', '');
        $this->backfill = filter_var(env('sgx.backfill', false), FILTER_VALIDATE_BOOLEAN);
        $origins = (string) env('cors.allowedOrigins', 'https://metaoptics.sg');
        $this->corsOrigins = array_values(array_filter(array_map('trim', explode(',', $origins))));
    }
}
