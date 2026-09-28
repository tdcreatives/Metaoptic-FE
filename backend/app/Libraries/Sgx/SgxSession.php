<?php
declare(strict_types=1);

namespace App\Libraries\Sgx;

use Config\Sgx;
use JsonException;

/**
 * Bootstraps the undocumented SGX website auth token (authorizationToken).
 *
 * Flow mirrors www.sgx.com: load appconfig → CMS we_chat_qr_validator → ROT13.
 */
final class SgxSession
{
    private ?string $token = null;

    /** @param callable(string, string, array<string, string>): string $transport */
    public function __construct(
        private readonly Sgx $config,
        private $transport,
    ) {
    }

    public function refresh(): void
    {
        if ($this->token !== null && $this->token !== '') {
            return;
        }

        $cfgBody = ($this->transport)('GET', $this->config->appConfigURL, $this->browserHeaders());
        try {
            $cfg = json_decode($cfgBody, true, 512, JSON_THROW_ON_ERROR);
        } catch (JsonException $e) {
            throw new SgxFetchException('SGX appconfig malformed JSON', 0, $e);
        }

        $cms = is_array($cfg['endpoints'] ?? null)
            ? (string) ($cfg['endpoints']['CMS_API_URL'] ?? '')
            : '';
        $version = (string) ($cfg['CMS_VERSION'] ?? '');
        if ($cms === '' || $version === '') {
            throw new SgxFetchException('SGX appconfig missing CMS endpoints');
        }

        // ponytail: SPA uses encodeURI (colon stays); ceiling = SGX renames queryId
        $tokenUrl = rtrim($cms, '/') . '/?queryId=' . $version . ':we_chat_qr_validator';
        $tokenBody = ($this->transport)('GET', $tokenUrl, $this->browserHeaders());
        try {
            $decoded = json_decode($tokenBody, true, 512, JSON_THROW_ON_ERROR);
        } catch (JsonException $e) {
            throw new SgxFetchException('SGX CMS token malformed JSON', 0, $e);
        }

        $qr = is_array($decoded['data'] ?? null)
            ? (string) ($decoded['data']['qrValidator'] ?? '')
            : '';
        if ($qr === '') {
            throw new SgxFetchException('SGX CMS token missing qrValidator');
        }

        $this->token = $this->rot13($qr);
    }

    public function invalidate(): void
    {
        $this->token = null;
    }

    /** @return array<string, string> */
    public function headers(): array
    {
        $this->refresh();

        return array_merge($this->browserHeaders(), [
            'authorizationToken' => (string) $this->token,
        ]);
    }

    /** @return array<string, string> */
    private function browserHeaders(): array
    {
        return [
            'Accept' => 'application/json',
            'User-Agent' => 'MetaOptics-SGX-Mirror/1.0 (+https://metaoptics.sg)',
            'Origin' => 'https://www.sgx.com',
            'Referer' => 'https://www.sgx.com/securities/company-announcements',
        ];
    }

    private function rot13(string $value): string
    {
        return strtr(
            $value,
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
            'NOPQRSTUVWXYZABCDEFGHIJKLMnopqrstuvwxyzabcdefghijklm'
        );
    }
}
