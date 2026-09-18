<?php
declare(strict_types=1);

namespace App\Libraries\Admin;

use App\Models\EmailCampaignModel;
use DomainException;

final class SendEmailGate
{
    public function __construct(private readonly EmailCampaignModel $campaigns)
    {
    }

    /** @param array<string, mixed> $row */
    public function assertCanSend(array $row): void
    {
        if (($row['state'] ?? '') !== 'published') {
            throw new DomainException('not_published');
        }
        $existing = $this->campaigns->where('announcement_id', $row['id'] ?? 0)->first();
        if ($existing !== null) {
            throw new DomainException('campaign_exists');
        }
    }

    /** @param array<string, mixed> $row */
    public function queueCampaign(array $row): int
    {
        $this->assertCanSend($row);

        $id = $this->campaigns->insert([
            'announcement_id' => $row['id'],
            'subject' => $this->firstNonEmpty($row, 'email_subject', 'title'),
            'body_html' => $this->firstNonEmpty($row, 'email_intro', 'summary'),
            'status' => 'queued',
        ], true);

        return (int) $id;
    }

    /** @param array<string, mixed> $row */
    private function firstNonEmpty(array $row, string $primary, string $fallback): string
    {
        $value = $row[$primary] ?? '';
        if (is_string($value) && $value !== '') {
            return $value;
        }

        return (string) ($row[$fallback] ?? '');
    }
}
