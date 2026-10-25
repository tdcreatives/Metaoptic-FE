<?php
declare(strict_types=1);

namespace App\Libraries\Http;

use Config\Turnstile;
use Config\Services;

final class TurnstileVerifier
{
    private string $failure = '';

    /** @param null|callable(string, array<string, string>): array $transport */
    public function __construct(
        private readonly Turnstile $config,
        private $transport = null,
    ) {
    }

    /** Reason for the last failed verify(); empty after success or when captcha is not required. */
    public function failure(): string
    {
        return $this->failure;
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
        $this->failure = '';
        if (! $this->isRequired()) {
            return true;
        }
        $token = trim($token);
        if ($token === '') {
            $this->failure = 'missing-token';

            return false;
        }
        if ($this->config->secretKey === '') {
            $this->failure = 'missing-secret';

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
            $this->failure = 'transport';

            return false;
        }

        if (($data['success'] ?? false) === true) {
            return true;
        }

        $this->failure = self::errorCodes($data);

        return false;
    }

    /** @param array<string, mixed> $data */
    private static function errorCodes(array $data): string
    {
        $codes = $data['error-codes'] ?? [];
        if (! is_array($codes)) {
            return 'rejected';
        }
        $safe = [];
        foreach ($codes as $code) {
            if (is_string($code) && preg_match('/^[a-z0-9_-]{1,40}$/', $code) === 1) {
                $safe[] = $code;
            }
        }

        return $safe !== [] ? implode(',', $safe) : 'rejected';
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
