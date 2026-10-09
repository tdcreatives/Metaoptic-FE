<?php
declare(strict_types=1);

namespace App\Libraries\Email;

use CodeIgniter\Database\BaseConnection;
use PDO;
use PDOException;

class CampaignFanout
{
    /** @param list<string> $categories */
    public function fanout(PDO|BaseConnection $db, int $campaignId, array $categories): int
    {
        $categories = array_values(array_filter($categories, static fn ($c) => $c !== ''));
        if ($categories === []) {
            return 0;
        }

        if ($db instanceof PDO) {
            return $this->fanoutPdo($db, $campaignId, $categories);
        }

        $before = $db->table('email_deliveries')->where('campaign_id', $campaignId)->countAllResults();
        $ignore = ((string) $db->DBDriver === 'SQLite3') ? 'INSERT OR IGNORE' : 'INSERT IGNORE';
        $deliveries = $db->prefixTable('email_deliveries');
        $subscribers = $db->prefixTable('subscribers');
        $categoryTable = $db->prefixTable('subscriber_categories');
        $placeholders = implode(',', array_fill(0, count($categories), '?'));
        $db->query(
            "{$ignore} INTO {$deliveries} (campaign_id, subscriber_id, status)
             SELECT DISTINCT ?, s.id, ?
             FROM {$subscribers} s
             INNER JOIN {$categoryTable} sc ON sc.subscriber_id = s.id
             WHERE s.status = ? AND sc.category_key IN ({$placeholders})",
            array_merge([$campaignId, 'queued', 'active'], $categories)
        );

        $db->table('email_campaigns')->where('id', $campaignId)->update([
            'recipient_count' => $db->table('email_deliveries')->where('campaign_id', $campaignId)->countAllResults(),
        ]);

        return $db->table('email_deliveries')->where('campaign_id', $campaignId)->countAllResults() - $before;
    }

    /** @param list<string> $categories */
    private function fanoutPdo(PDO $pdo, int $campaignId, array $categories): int
    {
        $placeholders = implode(',', array_fill(0, count($categories), '?'));
        $select = $pdo->prepare(
            "SELECT DISTINCT s.id FROM subscribers s
             INNER JOIN subscriber_categories sc ON sc.subscriber_id = s.id
             WHERE s.status = ? AND sc.category_key IN ({$placeholders})"
        );
        $select->execute(array_merge(['active'], $categories));
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
            } catch (PDOException $e) {
                if (! $this->isUniqueViolation($e)) {
                    throw $e;
                }
            }
        }

        $countStmt = $pdo->prepare(
            'SELECT COUNT(*) FROM email_deliveries WHERE campaign_id = :id'
        );
        $countStmt->execute(['id' => $campaignId]);
        $update = $pdo->prepare(
            'UPDATE email_campaigns SET recipient_count = :count WHERE id = :id'
        );
        $update->execute([
            'count' => (int) $countStmt->fetchColumn(),
            'id' => $campaignId,
        ]);

        return $inserted;
    }

    private function isUniqueViolation(PDOException $e): bool
    {
        $sqlState = (string) ($e->errorInfo[0] ?? $e->getCode());
        if ($sqlState === '23000') {
            return true;
        }

        return (int) ($e->errorInfo[1] ?? 0) === 19;
    }
}
