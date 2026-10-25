<?php
declare(strict_types=1);

namespace App\Libraries\Quote;

use Config\Services;
use JsonException;
use Throwable;

final class MotQuoteClient
{
    public const SECURITIES_URL = 'https://api.sgx.com/securities/v1.1?params=nc,lt,o,h,l,pv,c,vl,v,trading_time';

    /** @var callable(string, string, array<string, string>): string */
    private $transport;

    /** @param (callable(string, string, array<string, string>): string)|null $transport */
    public function __construct(?callable $transport = null)
    {
        $this->transport = $transport ?? $this->defaultTransport();
    }

    public function fetch9mt(): MotQuote
    {
        $body = ($this->transport)('GET', self::SECURITIES_URL, [
            'Accept' => 'application/json',
            'User-Agent' => 'MetaOptics-IR-Sync/1.0',
        ]);

        try {
            $decoded = json_decode($body, true, 512, JSON_THROW_ON_ERROR);
        } catch (JsonException $e) {
            throw new MotQuoteFetchException('SGX securities malformed JSON', 0, $e);
        }

        $rows = $this->decodeRows($decoded);
        foreach ($rows as $row) {
            if (! is_array($row)) {
                continue;
            }
            if (($row['nc'] ?? null) !== '9MT') {
                continue;
            }

            return $this->rowToQuote($row);
        }

        throw new MotQuoteFetchException('SGX 9MT row missing');
    }

    /**
     * Primary envelope: { data: { prices: [...] } }; also top-level list or data as list.
     *
     * @return list<mixed>
     */
    private function decodeRows(mixed $decoded): array
    {
        if (! is_array($decoded)) {
            throw new MotQuoteFetchException('SGX securities response shape invalid');
        }

        if (array_is_list($decoded)) {
            return $decoded;
        }

        $data = $decoded['data'] ?? null;
        if (is_array($data) && isset($data['prices']) && is_array($data['prices'])) {
            return array_values($data['prices']);
        }
        if (is_array($data) && array_is_list($data)) {
            return $data;
        }

        throw new MotQuoteFetchException('SGX securities prices missing');
    }

    /** @param array<string, mixed> $row */
    private function rowToQuote(array $row): MotQuote
    {
        $last = $this->requireFiniteNumber($row['lt'] ?? null, 'lt', true);
        $priorClose = $this->requireFiniteNumber($row['pv'] ?? null, 'pv', true);

        $tradingTime = $row['trading_time'] ?? null;

        return new MotQuote(
            '9MT',
            (float) $last,
            (float) $priorClose,
            (float) ($row['o'] ?? 0),
            (float) ($row['h'] ?? 0),
            (float) ($row['l'] ?? 0),
            (float) ($row['vl'] ?? 0),
            (float) ($row['v'] ?? 0),
            is_string($tradingTime) ? $tradingTime : (is_scalar($tradingTime) ? (string) $tradingTime : null),
        );
    }

    private function requireFiniteNumber(mixed $value, string $field, bool $mustBePositive = false): float
    {
        if (! is_int($value) && ! is_float($value) && ! (is_string($value) && is_numeric($value))) {
            throw new MotQuoteFetchException('SGX 9MT invalid ' . $field);
        }
        $n = (float) $value;
        if (! is_finite($n) || ($mustBePositive && $n <= 0.0)) {
            throw new MotQuoteFetchException('SGX 9MT invalid ' . $field);
        }

        return $n;
    }

    /** @return callable(string, string, array<string, string>): string */
    private function defaultTransport(): callable
    {
        return static function (string $method, string $url, array $headers): string {
            try {
                $client = Services::curlrequest(['timeout' => 10, 'http_errors' => false], null, null, false);
                $response = $client->request($method, $url, ['headers' => $headers]);
            } catch (Throwable $e) {
                throw new MotQuoteFetchException('SGX securities network error: ' . $e->getMessage(), 0, $e);
            }

            $code = $response->getStatusCode();
            if ($code < 200 || $code >= 300) {
                throw new MotQuoteFetchException('SGX securities HTTP ' . $code);
            }

            return (string) $response->getBody();
        };
    }
}
