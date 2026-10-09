<?php
declare(strict_types=1);

namespace App\Libraries\Email;

use Config\EmailAlerts;
use InvalidArgumentException;

final class UnsubscribeToken
{
    public function __construct(private readonly string $secret)
    {
        if (strlen($this->secret) < 32) {
            throw new InvalidArgumentException('unsubscribe secret must be at least 32 characters');
        }
    }

    public function pageUrl(string $plainToken): string
    {
        $site = rtrim((string) config(EmailAlerts::class)->publicSiteUrl, '/');

        return $site . '/investor-relations/resources/email-alerts?unsub=' . rawurlencode($plainToken);
    }

    public function forSubscriber(int $id): string
    {
        return hash_hmac('sha256', 'unsub:' . $id, $this->secret);
    }

    public function hashPlain(string $plain): string
    {
        return hash('sha256', $plain);
    }

    public function matches(string $plain, string $storedHash): bool
    {
        return hash_equals($storedHash, $this->hashPlain($plain));
    }
}
