<?php
namespace Config;

use CodeIgniter\Config\BaseConfig;

class Turnstile extends BaseConfig
{
    public string $secretKey = '';
    public string $verifyURL = 'https://challenges.cloudflare.com/turnstile/siteverify';

    public function __construct()
    {
        parent::__construct();
        $this->secretKey = trim((string) env('turnstile.secretKey', ''));
        $url = trim((string) env('turnstile.verifyURL', ''));
        if ($url !== '') {
            $this->verifyURL = $url;
        }
    }
}
