<?php
declare(strict_types=1);

namespace App\Libraries\Email;

use App\Models\EmailAlertAnnouncementModel;
use App\Models\EmailAlertModel;
use App\Models\EmailCampaignModel;
use DomainException;

final class AlertDispatchService
{
    public function __construct(
        private readonly EmailAlertModel $alerts = new EmailAlertModel(),
        private readonly EmailAlertAnnouncementModel $attaches = new EmailAlertAnnouncementModel(),
        private readonly EmailCampaignModel $campaigns = new EmailCampaignModel(),
        private readonly CampaignFanout $fanout = new CampaignFanout(),
        private readonly AudienceResolver $audience = new AudienceResolver(),
        private readonly AlertBodyRenderer $renderer = new AlertBodyRenderer(),
    ) {
    }

    /**
     * @throws DomainException not_draft_or_scheduled|no_announcements|empty_audience|not_published
     */
    public function dispatch(int $alertId): int
    {
        $db = db_connect();
        $db->transBegin();
        try {
            $alert = $this->alerts->find($alertId);
            if (! is_array($alert) || ! in_array((string) $alert['status'], ['draft', 'scheduled'], true)) {
                throw new DomainException('not_draft_or_scheduled');
            }

            $rows = $db->table('email_alert_announcements eaa')
                ->select('eaa.id, eaa.sort_order, a.title, a.category, a.filed_at, a.source_url, a.sgx_reference, a.state')
                ->join('announcements a', 'a.id = eaa.announcement_id')
                ->where('eaa.email_alert_id', $alertId)
                ->orderBy('eaa.sort_order', 'ASC')
                ->orderBy('eaa.id', 'ASC')
                ->get()
                ->getResultArray();

            if ($rows === []) {
                throw new DomainException('no_announcements');
            }
            foreach ($rows as $row) {
                if (($row['state'] ?? '') !== 'published') {
                    throw new DomainException('not_published');
                }
            }

            foreach ($rows as $row) {
                $this->attaches->update((int) $row['id'], [
                    'snap_title' => $row['title'],
                    'snap_category' => $row['category'],
                    'snap_filed_at' => $row['filed_at'],
                    'snap_url' => $row['source_url'],
                    'snap_sgx_reference' => $row['sgx_reference'],
                ]);
            }

            $categories = $this->audience->categoryUnion($rows);
            if ($categories === []) {
                throw new DomainException('empty_audience');
            }

            $items = [];
            foreach ($rows as $row) {
                $items[] = [
                    'title' => (string) $row['title'],
                    'filed_at' => (string) $row['filed_at'],
                    'url' => (string) ($row['source_url'] ?? ''),
                ];
            }
            $body = $this->renderer->render(
                (string) $alert['body_html'],
                (string) ($alert['intro'] ?? ''),
                $items,
            );

            $this->alerts->update($alertId, ['status' => 'sending']);

            $campaignId = (int) $this->campaigns->insert([
                'announcement_id' => null,
                'email_alert_id' => $alertId,
                'subject' => (string) $alert['subject'],
                'body_html' => $body,
                'status' => 'queued',
            ], true);

            $this->fanout->fanout($db, $campaignId, $categories);

            $this->alerts->update($alertId, [
                'campaign_id' => $campaignId,
                'audience_categories_json' => json_encode($categories, JSON_THROW_ON_ERROR),
                'status' => 'sent',
                'sent_at' => date('Y-m-d H:i:s'),
            ]);

            $db->transCommit();

            return $campaignId;
        } catch (\Throwable $e) {
            $db->transRollback();
            throw $e;
        }
    }
}
