<?php
declare(strict_types=1);

namespace App\Libraries\Admin;

use App\Libraries\Email\CampaignFanout;
use App\Models\EmailCampaignModel;
use DomainException;

final class SendEmailGate
{
    public function __construct(
        private readonly EmailCampaignModel $campaigns,
        private readonly CampaignFanout $fanout = new CampaignFanout(),
    ) {
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

        $db = db_connect();
        $db->transBegin();
        try {
            $id = (int) $this->campaigns->insert([
                'announcement_id' => $row['id'],
                'subject' => $this->firstNonEmpty($row, 'email_subject', 'title'),
                'body_html' => $this->firstNonEmpty($row, 'email_intro', 'summary'),
                'status' => 'queued',
            ], true);

            $this->fanout->fanout(
                $db,
                $id,
                (string) ($row['category'] ?? '')
            );

            $db->transCommit();

            return $id;
        } catch (\Throwable $e) {
            $db->transRollback();
            throw $e;
        }
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
