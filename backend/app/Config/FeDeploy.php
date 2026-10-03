<?php
declare(strict_types=1);

namespace Config;

use CodeIgniter\Config\BaseConfig;

/**
 * Cloudflare Pages (or other) deploy hook after CMS publish/archive.
 * Empty URL disables outbound calls (local default).
 */
class FeDeploy extends BaseConfig
{
    public string $deployHookURL = '';

    public int $deployHookTimeout = 5;

    public function __construct()
    {
        parent::__construct();
        $this->deployHookURL = trim((string) env('fe.deployHookURL', ''));
        $this->deployHookTimeout = max(1, (int) env('fe.deployHookTimeout', 5));
    }
}
