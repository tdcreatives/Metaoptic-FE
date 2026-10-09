<?php
declare(strict_types=1);

namespace App\Libraries\Email;

use App\Models\SubscriberModel;

final class UnsubscribeService
{
    public function __construct(
        private readonly UnsubscribeToken $tokens,
        private readonly SubscriberModel $subscribers = new SubscriberModel(),
    ) {
    }

    public function unsubscribe(string $token): void
    {
        if ($token === '') {
            return;
        }

        $row = $this->subscribers->where('unsubscribe_token_hash', $this->tokens->hashPlain($token))->first();
        if ($row === null || ($row['status'] ?? '') === 'unsubscribed') {
            return;
        }

        $this->subscribers->update((int) $row['id'], [
            'status' => 'unsubscribed',
            'unsubscribed_at' => date('Y-m-d H:i:s'),
        ]);
    }
}
