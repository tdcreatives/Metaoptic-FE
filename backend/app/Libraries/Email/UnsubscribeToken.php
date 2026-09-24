<?php
declare(strict_types=1);

namespace App\Libraries\Email;

final class UnsubscribeToken
{
    public function __construct(private readonly string $secret)
    {
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
