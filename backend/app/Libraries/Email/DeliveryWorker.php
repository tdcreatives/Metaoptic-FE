<?php
declare(strict_types=1);

namespace App\Libraries\Email;

use CodeIgniter\Database\BaseConnection;
use Config\EmailAlerts;

final class DeliveryWorker
{
    public function __construct(
        private readonly BaseConnection $db,
        private readonly MailerInterface $mailer,
        private readonly UnsubscribeToken $tokens,
    ) {
    }

    public function processBatch(int $limit = 100): int
    {
        $claimed = $this->claimQueued($limit);
        $campaignIds = [];
        foreach ($claimed as $row) {
            $campaignIds[(int) $row['campaign_id']] = true;
            $this->processOne($row);
        }
        foreach (array_keys($campaignIds) as $campaignId) {
            $this->closeCampaignIfTerminal((int) $campaignId);
        }

        return count($claimed);
    }

    /** @return list<array<string, mixed>> */
    private function claimQueued(int $limit): array
    {
        $limit = max(0, $limit);
        $this->db->transBegin();

        $driver = (string) $this->db->DBDriver;
        if ($limit > 0 && ($driver === 'MySQLi' || $driver === 'MySQL')) {
            $rows = $this->db->query(
                "SELECT * FROM email_deliveries WHERE status = 'queued' ORDER BY id ASC LIMIT {$limit} FOR UPDATE"
            )->getResultArray();
        } else {
            $rows = $this->db->table('email_deliveries')
                ->where('status', 'queued')
                ->orderBy('id', 'ASC')
                ->limit($limit)
                ->get()
                ->getResultArray();
        }

        $claimed = [];
        foreach ($rows as $row) {
            $this->db->table('email_deliveries')
                ->where('id', $row['id'])
                ->where('status', 'queued')
                ->set('status', 'sending')
                ->set('attempts', 'attempts + 1', false)
                ->update();
            if ($this->db->affectedRows() < 1) {
                continue;
            }
            $fresh = $this->db->table('email_deliveries')->where('id', $row['id'])->get()->getRowArray();
            if ($fresh !== null) {
                $claimed[] = $fresh;
            }
        }

        $this->db->transComplete();

        return $claimed;
    }

    /** @param array<string, mixed> $row */
    private function processOne(array $row): void
    {
        $subscriber = $this->db->table('subscribers')->where('id', $row['subscriber_id'])->get()->getRowArray();
        if ($subscriber === null || ($subscriber['status'] ?? '') !== 'active') {
            $this->finishDelivery($row, 'failed_perm', null, 'unsubscribed');

            return;
        }

        try {
            $providerId = $this->mailer->send($this->buildMessage($row, $subscriber));
            $this->finishDelivery($row, 'sent', $providerId, null);
        } catch (\Throwable $e) {
            $attempts = (int) $row['attempts'];
            $status = $attempts < 3 ? 'failed_temp' : 'failed_perm';
            $this->finishDelivery($row, $status, null, $e->getMessage());
        }
    }

    /**
     * @param array<string, mixed> $row
     * @param array<string, mixed> $subscriber
     */
    private function buildMessage(array $row, array $subscriber): MailMessage
    {
        $ctx = $this->db->table('email_campaigns as c')
            ->select('c.subject, c.body_html, a.title, a.email_intro')
            ->join('announcements as a', 'a.id = c.announcement_id')
            ->where('c.id', $row['campaign_id'])
            ->get()
            ->getRowArray() ?? [];

        $site = rtrim((string) config(EmailAlerts::class)->publicSiteUrl, '/');
        $unsub = $site . '/investor-relations/resources/email-alerts?unsub='
            . $this->tokens->forSubscriber((int) $row['subscriber_id']);

        $title = (string) ($ctx['title'] ?? $ctx['subject'] ?? '');
        $intro = (string) (($ctx['email_intro'] ?? '') !== '' ? $ctx['email_intro'] : ($ctx['body_html'] ?? ''));
        $body = (string) view('emails/announcement', [
            'title' => $title,
            'intro' => $intro,
            'unsubscribeUrl' => $unsub,
        ]);

        return new MailMessage(
            (string) $subscriber['email'],
            (string) ($ctx['subject'] ?? $title),
            $body,
        );
    }

    /** @param array<string, mixed> $row */
    private function finishDelivery(array $row, string $status, ?string $providerId, ?string $error): void
    {
        $this->db->table('email_deliveries')->where('id', $row['id'])->update([
            'status' => $status,
            'provider_message_id' => $providerId,
            'last_error' => $error === null ? null : substr($error, 0, 1000),
        ]);
    }

    private function closeCampaignIfTerminal(int $campaignId): void
    {
        $open = $this->db->table('email_deliveries')
            ->where('campaign_id', $campaignId)
            ->whereIn('status', ['queued', 'sending', 'failed_temp'])
            ->countAllResults();
        if ($open > 0) {
            return;
        }

        $failed = $this->db->table('email_deliveries')
            ->where('campaign_id', $campaignId)
            ->where('status', 'failed_perm')
            ->countAllResults();

        $this->db->table('email_campaigns')->where('id', $campaignId)->update([
            'status' => $failed > 0 ? 'partial_failed' : 'sent',
            'sent_at' => date('Y-m-d H:i:s'),
        ]);
    }
}
