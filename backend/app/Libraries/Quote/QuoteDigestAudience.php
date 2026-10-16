<?php
declare(strict_types=1);

namespace App\Libraries\Quote;

final class QuoteDigestAudience
{
    public const CATEGORY = 'Press Release';

    /** @return list<array{id:int,email:string}> */
    public function activePressReleaseSubscribers(): array
    {
        $db = db_connect();

        $rows = $db->table('subscribers s')
            ->select('s.id, s.email')
            ->distinct()
            ->join('subscriber_categories sc', 'sc.subscriber_id = s.id')
            ->where('s.status', 'active')
            ->where('sc.category_key', self::CATEGORY)
            ->get()
            ->getResultArray();

        $out = [];
        foreach ($rows as $row) {
            $out[] = [
                'id' => (int) $row['id'],
                'email' => (string) $row['email'],
            ];
        }

        return $out;
    }
}
