<?php
declare(strict_types=1);

namespace App\Libraries\Email;

use App\Models\SubscriberCategoryModel;
use App\Models\SubscriberModel;
use InvalidArgumentException;

final class SubscribeService
{
    public function __construct(
        private readonly MailerInterface $mailer,
        private readonly UnsubscribeToken $tokens,
        private readonly EmailNormalizer $normalizer = new EmailNormalizer(),
        private readonly SubscriberModel $subscribers = new SubscriberModel(),
        private readonly SubscriberCategoryModel $categoryRows = new SubscriberCategoryModel(),
    ) {
    }

    /** @param array<string, mixed> $input */
    public function subscribe(array $input): void
    {
        if ((string) ($input['website'] ?? '') !== '') {
            return;
        }

        try {
            $email = $this->normalizer->normalize((string) ($input['email'] ?? ''));
        } catch (InvalidArgumentException) {
            return;
        }

        $categories = $input['categories'] ?? [];
        if (! is_array($categories)) {
            return;
        }
        $categories = array_values(array_unique(array_map(static fn ($k): string => (string) $k, $categories)));
        if ($categories === []) {
            return;
        }
        try {
            CategoryCatalog::assertValid($categories);
        } catch (InvalidArgumentException) {
            return;
        }

        $first = $this->nullableName($input['first_name'] ?? null);
        $last = $this->nullableName($input['last_name'] ?? null);

        $existing = $this->subscribers->where('email', $email)->first();
        if ($existing === null) {
            $this->insertNew($email, $first, $last, $categories);

            return;
        }

        $id = (int) $existing['id'];
        if (($existing['status'] ?? '') === 'unsubscribed') {
            $this->reactivate($id, $categories);

            return;
        }

        $this->replaceCategories($id, $categories);
    }

    /** @param list<string> $categories */
    private function insertNew(string $email, ?string $first, ?string $last, array $categories): void
    {
        $now = date('Y-m-d H:i:s');
        $id = (int) $this->subscribers->insert([
            'email' => $email,
            'first_name' => $first,
            'last_name' => $last,
            'status' => 'active',
            'consented_at' => $now,
            'unsubscribed_at' => null,
            'unsubscribe_token_hash' => null,
        ], true);

        $plain = $this->tokens->forSubscriber($id);
        $this->subscribers->update($id, [
            'unsubscribe_token_hash' => $this->tokens->hashPlain($plain),
        ]);
        $this->replaceCategories($id, $categories);
        $this->sendConfirmation($email, $plain);
    }

    /** @param list<string> $categories */
    private function reactivate(int $id, array $categories): void
    {
        $plain = $this->tokens->forSubscriber($id);
        $this->subscribers->update($id, [
            'status' => 'active',
            'consented_at' => date('Y-m-d H:i:s'),
            'unsubscribed_at' => null,
            'unsubscribe_token_hash' => $this->tokens->hashPlain($plain),
        ]);
        $this->replaceCategories($id, $categories);
        $row = $this->subscribers->find($id);
        $this->sendConfirmation((string) ($row['email'] ?? ''), $plain);
    }

    /** @param list<string> $categories */
    private function replaceCategories(int $subscriberId, array $categories): void
    {
        $this->categoryRows->where('subscriber_id', $subscriberId)->delete();
        foreach ($categories as $key) {
            $this->categoryRows->insert([
                'subscriber_id' => $subscriberId,
                'category_key' => $key,
            ]);
        }
    }

    private function sendConfirmation(string $email, string $plainToken): void
    {
        $url = $this->tokens->pageUrl($plainToken);
        $body = (string) view('emails/confirmation', ['unsubscribeUrl' => $url]);
        $this->mailer->send(new MailMessage(
            $email,
            'Confirm your MetaOptics IR alerts subscription',
            $body,
        ));
    }

    private function nullableName(mixed $value): ?string
    {
        if (! is_string($value)) {
            return null;
        }
        $trimmed = trim($value);

        return $trimmed === '' ? null : $trimmed;
    }
}
