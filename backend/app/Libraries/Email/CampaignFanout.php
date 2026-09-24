<?php
declare(strict_types=1);

namespace App\Libraries\Email;

use CodeIgniter\Database\BaseConnection;
use PDO;
use PDOException;

final class CampaignFanout
{
    public function fanout(PDO|BaseConnection $db, int $campaignId, string $announcementCategory): int
    {
        if ($db instanceof PDO) {
            return $this->fanoutPdo($db, $campaignId, $announcementCategory);
        }

        $rows = $db->table('subscribers as s')
            ->select('s.id')
            ->join('subscriber_categories as sc', 'sc.subscriber_id = s.id')
            ->where('s.status', 'active')
            ->where('sc.category_key', $announcementCategory)
            ->get()
            ->getResultArray();

        $inserted = 0;
        foreach ($rows as $row) {
            $db->table('email_deliveries')->ignore(true)->insert([
                'campaign_id' => $campaignId,
                'subscriber_id' => (int) $row['id'],
                'status' => 'queued',
            ]);
            if ($db->affectedRows() > 0) {
                $inserted++;
            }
        }

        $db->table('email_campaigns')->where('id', $campaignId)->update([
            'recipient_count' => $inserted,
        ]);

        return $inserted;
    }

    private function fanoutPdo(PDO $pdo, int $campaignId, string $announcementCategory): int
    {
        $select = $pdo->prepare(
            'SELECT s.id FROM subscribers s
             INNER JOIN subscriber_categories sc ON sc.subscriber_id = s.id
             WHERE s.status = :status AND sc.category_key = :category'
        );
        $select->execute([
            'status' => 'active',
            'category' => $announcementCategory,
        ]);
        $ids = $select->fetchAll(PDO::FETCH_COLUMN);

        $insert = $pdo->prepare(
            'INSERT INTO email_deliveries (campaign_id, subscriber_id, status)
             VALUES (:campaign_id, :subscriber_id, :status)'
        );
        $inserted = 0;
        foreach ($ids as $subscriberId) {
            try {
                $insert->execute([
                    'campaign_id' => $campaignId,
                    'subscriber_id' => (int) $subscriberId,
                    'status' => 'queued',
                ]);
                $inserted++;
            } catch (PDOException) {
                // UNIQUE (campaign_id, subscriber_id)
            }
        }

        $update = $pdo->prepare(
            'UPDATE email_campaigns SET recipient_count = :count WHERE id = :id'
        );
        $update->execute([
            'count' => $inserted,
            'id' => $campaignId,
        ]);

        return $inserted;
    }
}
