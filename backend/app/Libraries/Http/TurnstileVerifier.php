<?php
declare(strict_types=1);

namespace App\Libraries\Http;

use Config\Turnstile;
use Config\Services;

final class TurnstileVerifier
{
    /** @param null|callable(string, array<string, string>): array $transport */
    public function __construct(
        private readonly Turnstile $config,
        private $transport = null,
    ) {
    }

    public function isRequired(): bool
    {
        if ($this->config->secretKey !== '') {
            return true;
        }
        // ponytail: local/test may omit secret; production must set turnstile.secretKey
        return ! in_array(ENVIRONMENT, ['development', 'testing'], true);
    }

    public function verify(string $token, ?string $remoteIp = null): bool
    {
        if (! $this->isRequired()) {
            return true;
        }
        $token = trim($token);
        if ($token === '' || $this->config->secretKey === '') {
            return false;
        }

        $fields = [
            'secret' => $this->config->secretKey,
            'response' => $token,
        ];
        if ($remoteIp !== null && $remoteIp !== '') {
            $fields['remoteip'] = $remoteIp;
        }

        try {
            $data = ($this->transport ?? [$this, 'defaultTransport'])($this->config->verifyURL, $fields);
        } catch (\Throwable) {
            return false;
        }

        return ($data['success'] ?? false) === true;
    }

    /** @param array<string, string> $fields @return array<string, mixed> */
    private function defaultTransport(string $url, array $fields): array
    {
        $client = Services::curlrequest(['http_errors' => false, 'timeout' => 5], null, null, false);
        $res = $client->post($url, ['form_params' => $fields]);
        $decoded = json_decode((string) $res->getBody(), true);

        return is_array($decoded) ? $decoded : ['success' => false];
    }
}
