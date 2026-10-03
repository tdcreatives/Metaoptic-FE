<?php
declare(strict_types=1);

namespace Config;

use CodeIgniter\Config\BaseConfig;

class Sgx extends BaseConfig
{
    /** Announcements API base, e.g. https://api.sgx.com/announcements/v1.1 */
    public string $baseURL = '';
    /** Company search value, e.g. METAOPTICS LTD */
    public string $companyCode = '';
    public bool $backfill = false;
    public bool $exactSearch = true;
    public int $pageSize = 20;
    /** Fetch + parse links.sgx.com HTML for description / attachments / extra fields */
    public bool $fetchDetailHtml = true;
    /** SPA config used to resolve CMS token endpoint + version */
    public string $appConfigURL = 'https://www.sgx.com/config/appconfig.json';
    /** @var list<string> */
    public array $corsOrigins = [];

    public function __construct()
    {
        parent::__construct();
        $this->baseURL = rtrim((string) env('sgx.baseURL', 'https://api.sgx.com/announcements/v1.1'), '/');
        $this->companyCode = (string) env('sgx.companyCode', 'METAOPTICS LTD');
        $this->backfill = filter_var(env('sgx.backfill', false), FILTER_VALIDATE_BOOLEAN);
        $this->exactSearch = filter_var(env('sgx.exactSearch', true), FILTER_VALIDATE_BOOLEAN);
        $this->pageSize = max(1, (int) env('sgx.pageSize', 20));
        $this->fetchDetailHtml = filter_var(env('sgx.fetchDetailHtml', true), FILTER_VALIDATE_BOOLEAN);
        $this->appConfigURL = (string) env('sgx.appConfigURL', 'https://www.sgx.com/config/appconfig.json');
        $origins = (string) env('cors.allowedOrigins', 'https://metaoptics.sg');
        $this->corsOrigins = array_values(array_filter(array_map('trim', explode(',', $origins))));
    }
}
