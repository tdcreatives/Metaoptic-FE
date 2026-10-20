<?php
declare(strict_types=1);

namespace App\Libraries\Admin;

use Config\FeDeploy;
use Config\Services;
use Throwable;

/**
 * Fire-and-forget POST to Cloudflare Pages Deploy Hook (or compatible URL).
 * Never throws to callers — Publish/Archive must succeed even if CF is down.
 */
final class FeDeployHook
{
    /** @var callable(string, int): array{ok: bool, status?: int, error?: string} */
    private $poster;

    /**
     * @param null|callable(string, int): array{ok: bool, status?: int, error?: string} $poster
     */
    public function __construct(
        private readonly string $url,
        private readonly int $timeoutSeconds = 5,
        ?callable $poster = null,
    ) {
        $this->poster = $poster ?? [$this, 'defaultPost'];
    }

    public static function fromConfig(): self
    {
        $cfg = config(FeDeploy::class);

        return new self($cfg->deployHookURL, $cfg->deployHookTimeout);
    }

    public function trigger(string $reason): void
    {
        if ($this->url === '') {
            return;
        }

        $this->attempt($reason);
    }

    public function attempt(string $reason): bool
    {
        if ($this->url === '') {
            log_message('error', 'fe.deployHook attempt failed reason=' . $reason . ' error=empty_url');

            return false;
        }

        try {
            $result = ($this->poster)($this->url, $this->timeoutSeconds);
            if (($result['ok'] ?? false) === true) {
                log_message(
                    'info',
                    'fe.deployHook ok reason=' . $reason . ' status=' . (string) ($result['status'] ?? '')
                );

                return true;
            }

            log_message(
                'error',
                'fe.deployHook failed reason=' . $reason
                . ' status=' . (string) ($result['status'] ?? '')
                . ' error=' . (string) ($result['error'] ?? 'unknown')
            );

            return false;
        } catch (Throwable $e) {
            log_message('error', 'fe.deployHook exception reason=' . $reason . ': ' . $e->getMessage());

            return false;
        }
    }

    /** @return array{ok: bool, status?: int, error?: string} */
    private function defaultPost(string $url, int $timeoutSeconds): array
    {
        $client = Services::curlrequest([
            'http_errors' => false,
            'timeout' => $timeoutSeconds,
            'connect_timeout' => min(3, $timeoutSeconds),
        ], null, null, false);

        $response = $client->post($url, [
            'headers' => [
                'Content-Type' => 'application/json',
                'User-Agent' => 'MetaOptics-IR-CMS-FeDeployHook/1.0',
            ],
            'body' => '',
        ]);

        $status = $response->getStatusCode();

        return [
            'ok' => $status >= 200 && $status < 300,
            'status' => $status,
            'error' => $status >= 200 && $status < 300 ? '' : ('HTTP ' . $status),
        ];
    }
}
