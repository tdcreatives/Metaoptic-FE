<?php
declare(strict_types=1);

namespace App\Libraries\Email;

final class AudienceResolver
{
    /** @param list<array<string, mixed>> $announcementRows */
    public function categoryUnion(array $announcementRows): array
    {
        $cats = [];
        foreach ($announcementRows as $row) {
            $c = trim((string) ($row['category'] ?? ''));
            if ($c !== '') {
                $cats[$c] = true;
            }
        }

        return array_keys($cats);
    }

    /** @param list<string> $categories */
    public function estimateSubscriberCount(array $categories): int
    {
        if ($categories === []) {
            return 0;
        }

        $db = db_connect();
        $rows = $db->table('subscribers s')
            ->select('s.id')
            ->distinct()
            ->join('subscriber_categories sc', 'sc.subscriber_id = s.id')
            ->where('s.status', 'active')
            ->whereIn('sc.category_key', $categories)
            ->get()
            ->getResultArray();

        return count($rows);
    }
}
