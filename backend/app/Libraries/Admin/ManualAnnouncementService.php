<?php
declare(strict_types=1);

namespace App\Libraries\Admin;

use App\Models\AnnouncementModel;
use InvalidArgumentException;

final class ManualAnnouncementService
{
    public function __construct(private readonly AnnouncementModel $model = new AnnouncementModel())
    {
    }

    /** @param array<string, mixed> $input */
    public function create(array $input): int
    {
        $title = trim((string) ($input['title'] ?? ''));
        if ($title === '') {
            throw new InvalidArgumentException('title required');
        }
        $category = trim((string) ($input['category'] ?? 'General Announcement')) ?: 'General Announcement';
        $filedAt = (string) ($input['filed_at'] ?? '');
        if ($filedAt === '') {
            throw new InvalidArgumentException('filed_at required');
        }
        $state = (string) ($input['state'] ?? 'pending_review');
        if (! in_array($state, ['pending_review', 'published'], true)) {
            throw new InvalidArgumentException('invalid state');
        }

        $payload = json_encode(['manual' => true], JSON_THROW_ON_ERROR);
        $slugBase = $this->slugify($category . '-' . $title . '-manual');
        $slug = $slugBase;
        $i = 1;
        while ($this->model->where('slug', $slug)->first() !== null) {
            $slug = substr($slugBase, 0, 180) . '-' . $i++;
        }

        $now = date('Y-m-d H:i:s');
        $id = $this->model->insert([
            'source' => 'manual',
            'sgx_reference' => null,
            'slug' => $slug,
            'source_url' => (string) ($input['source_url'] ?? ''),
            'title' => $title,
            'category' => $category,
            'issuer' => (string) ($input['issuer'] ?? ''),
            'filed_at' => $filedAt,
            'source_payload' => $payload,
            'source_hash' => hash('sha256', $payload),
            'summary' => $input['summary'] ?? null,
            'body_html' => $input['body_html'] ?? null,
            'state' => $state,
            'published_at' => $state === 'published' ? $now : null,
            'needs_review' => 0,
        ], true);

        return (int) $id;
    }

    private function slugify(string $value): string
    {
        $value = strtolower($value);
        $value = preg_replace('/[^a-z0-9]+/', '-', $value) ?? '';
        $value = trim($value, '-') ?: 'announcement';

        return substr($value, 0, 191);
    }
}
