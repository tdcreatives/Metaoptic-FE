<?php
declare(strict_types=1);

namespace App\Libraries\Sgx;

use Config\Sgx;
use Config\Services;
use JsonException;
use Throwable;

final class SgxHttpClient
{
    /** @var callable(string, string, array<string, string>): string */
    private $transport;

    private readonly SgxSession $session;

    /** @param (callable(string, string, array<string, string>): string)|null $transport */
    public function __construct(
        private readonly Sgx $config,
        ?callable $transport = null,
    ) {
        $this->transport = $transport ?? $this->defaultTransport();
        $this->session = new SgxSession($config, $this->transport);
    }

    /** @return list<array<string, mixed>> */
    public function fetchAllPages(): array
    {
        $headers = $this->session->headers();
        $total = $this->fetchTotal($headers);
        $pageSize = max(1, $this->config->pageSize);
        $items = [];
        $seen = [];
        $page = 0;

        while (true) {
            $body = $this->requestWithRetry('GET', $this->listUrl($page), $headers);
            $pageItems = $this->decodeList($body);

            if ($page === 0 && $pageItems === []) {
                throw new SgxFetchException('SGX empty first page');
            }
            if ($pageItems === []) {
                if ($total > 0 && $items === []) {
                    throw new SgxFetchException('SGX empty items with total > 0');
                }
                break;
            }

            foreach ($pageItems as $item) {
                if (! is_array($item)) {
                    throw new SgxFetchException('SGX item is not an object');
                }
                $ref = (string) ($item['ref_id'] ?? '');
                if ($ref !== '' && isset($seen[$ref])) {
                    continue;
                }
                if ($ref !== '') {
                    $seen[$ref] = true;
                }
                $items[] = $item;
            }

            if (count($pageItems) < $pageSize) {
                break;
            }
            if (count($items) >= $total) {
                break;
            }

            $page++;
            // ponytail: hard stop; upgrade if MetaOptics ever exceeds ~20k announcements
            if ($page > 1000) {
                throw new SgxFetchException('SGX pagination incomplete');
            }
        }

        return $items;
    }

    /**
     * Fetch links.sgx.com announcement HTML (no CMS token). Soft-used by sync enricher.
     */
    public function fetchHtml(string $url): string
    {
        $scheme = strtolower((string) (parse_url($url, PHP_URL_SCHEME) ?? ''));
        if ($scheme !== 'http' && $scheme !== 'https') {
            throw new SgxFetchException('Invalid detail URL scheme');
        }

        return ($this->transport)('GET', $url, [
            'User-Agent' => 'MetaOptics-IR-Sync/1.0',
            'Accept' => 'text/html,application/xhtml+xml',
        ]);
    }

    /** @param array<string, string> $headers */
    private function fetchTotal(array &$headers): int
    {
        $body = $this->requestWithRetry('GET', $this->countUrl(), $headers);
        try {
            $decoded = json_decode($body, true, 512, JSON_THROW_ON_ERROR);
        } catch (JsonException $e) {
            throw new SgxFetchException('SGX count malformed JSON', 0, $e);
        }

        if (! is_array($decoded) || ! is_numeric($decoded['data'] ?? null)) {
            throw new SgxFetchException('SGX count shape invalid');
        }

        return (int) $decoded['data'];
    }

    /** @return list<mixed> */
    private function decodeList(string $body): array
    {
        try {
            $decoded = json_decode($body, true, 512, JSON_THROW_ON_ERROR);
        } catch (JsonException $e) {
            throw new SgxFetchException('SGX malformed JSON', 0, $e);
        }

        if (! is_array($decoded)) {
            throw new SgxFetchException('SGX response shape invalid');
        }
        if (isset($decoded['message']) && ($decoded['data'] ?? null) === null && ! isset($decoded['meta'])) {
            throw new SgxFetchException('SGX response error: ' . (string) $decoded['message']);
        }
        if (! array_key_exists('data', $decoded)) {
            throw new SgxFetchException('SGX data missing');
        }
        if ($decoded['data'] === null) {
            return [];
        }
        if (! is_array($decoded['data'])) {
            throw new SgxFetchException('SGX data is not a list');
        }

        return array_values($decoded['data']);
    }

    /** @param array<string, string> $headers */
    private function requestWithRetry(string $method, string $url, array &$headers): string
    {
        $delays = [1, 2, 4];
        $attempt = 0;
        while (true) {
            try {
                return ($this->transport)($method, $url, $headers);
            } catch (SgxFetchException $e) {
                if ($attempt >= 3) {
                    throw $e;
                }
                if ($this->isAuthFailure($e)) {
                    $this->session->invalidate();
                    $headers = $this->session->headers();
                }
                // ponytail: real sleep; ceiling 7s per request; inject clock if tests need retry coverage
                sleep($delays[$attempt]);
                $attempt++;
            }
        }
    }

    private function isAuthFailure(SgxFetchException $e): bool
    {
        $msg = $e->getMessage();

        return str_contains($msg, 'HTTP 401') || str_contains($msg, 'HTTP 403');
    }

    private function listUrl(int $page): string
    {
        // pagestart is a 0-based page index (not a row offset) — matches www.sgx.com SPA.
        return $this->config->baseURL . '/company?' . http_build_query([
            'value' => $this->config->companyCode,
            'exactsearch' => $this->config->exactSearch ? 'true' : 'false',
            'pagestart' => $page,
            'pagesize' => $this->config->pageSize,
        ]);
    }

    private function countUrl(): string
    {
        return $this->config->baseURL . '/company/count?' . http_build_query([
            'value' => $this->config->companyCode,
            'exactsearch' => $this->config->exactSearch ? 'true' : 'false',
        ]);
    }

    /** @return callable(string, string, array<string, string>): string */
    private function defaultTransport(): callable
    {
        return static function (string $method, string $url, array $headers): string {
            try {
                $client = Services::curlrequest(['http_errors' => false], null, null, false);
                $response = $client->request($method, $url, ['headers' => $headers]);
            } catch (Throwable $e) {
                throw new SgxFetchException('SGX network error: ' . $e->getMessage(), 0, $e);
            }

            $code = $response->getStatusCode();
            if ($code >= 500 || $code === 401 || $code === 403) {
                throw new SgxFetchException('SGX HTTP ' . $code);
            }

            return (string) $response->getBody();
        };
    }
}
