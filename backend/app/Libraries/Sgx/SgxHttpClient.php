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
        $items = [];
        $page = 1;

        while (true) {
            $body = $this->requestWithRetry('GET', $this->listUrl($page), $headers);
            $decoded = $this->decodeAndValidate($body);
            $pageItems = $decoded['items'];
            $total = $decoded['total'];

            if ($page === 1 && $pageItems === []) {
                throw new SgxFetchException('SGX empty first page');
            }
            if ($pageItems === [] && $total > 0) {
                throw new SgxFetchException('SGX empty items with total > 0');
            }

            foreach ($pageItems as $item) {
                if (! is_array($item)) {
                    throw new SgxFetchException('SGX item is not an object');
                }
                $items[] = $item;
            }

            if (count($items) >= $total) {
                break;
            }

            $pageSize = max(1, $decoded['pageSize']);
            $maxPage = (int) ceil($total / $pageSize);
            if ($page >= $maxPage) {
                throw new SgxFetchException('SGX pagination incomplete');
            }
            $page++;
        }

        return $items;
    }

    /** @return array{items: list<mixed>, total: int, pageSize: int} */
    private function decodeAndValidate(string $body): array
    {
        try {
            $decoded = json_decode($body, true, 512, JSON_THROW_ON_ERROR);
        } catch (JsonException $e) {
            throw new SgxFetchException('SGX malformed JSON', 0, $e);
        }

        if (! is_array($decoded) || ($decoded['ok'] ?? false) !== true) {
            throw new SgxFetchException('SGX response shape invalid');
        }
        if (! isset($decoded['items']) || ! is_array($decoded['items'])) {
            throw new SgxFetchException('SGX items missing');
        }
        if (! isset($decoded['total']) || ! is_numeric($decoded['total'])) {
            throw new SgxFetchException('SGX total missing');
        }

        $pageSize = isset($decoded['pageSize']) && is_numeric($decoded['pageSize'])
            ? (int) $decoded['pageSize']
            : 0;

        return [
            'items' => array_values($decoded['items']),
            'total' => (int) $decoded['total'],
            'pageSize' => $pageSize,
        ];
    }

    /** @param array<string, string> $headers */
    private function requestWithRetry(string $method, string $url, array $headers): string
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
                // ponytail: real sleep; ceiling 7s per request; inject clock if tests need retry coverage
                sleep($delays[$attempt]);
                $attempt++;
            }
        }
    }

    private function listUrl(int $page): string
    {
        return $this->config->baseURL . '/announcements?' . http_build_query([
            'company' => $this->config->companyCode,
            'page' => $page,
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
            if ($response->getStatusCode() >= 500) {
                throw new SgxFetchException('SGX HTTP ' . $response->getStatusCode());
            }

            return (string) $response->getBody();
        };
    }
}
