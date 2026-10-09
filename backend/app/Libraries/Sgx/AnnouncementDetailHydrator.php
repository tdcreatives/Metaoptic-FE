<?php
declare(strict_types=1);

namespace App\Libraries\Sgx;

final class AnnouncementDetailHydrator
{
    /**
     * @param array<string, mixed> $row
     * @return array<string, mixed>
     */
    public static function hydrate(array $row): array
    {
        $id = (int) ($row['id'] ?? 0);
        if ($id < 1) {
            $row['_attachments'] = [];
            $row['_related'] = [];
            $row['_labeled_rows'] = [];

            return $row;
        }

        $db = db_connect();
        $row['_attachments'] = $db->table('announcement_attachments')
            ->where('announcement_id', $id)
            ->orderBy('sort_order', 'ASC')
            ->get()
            ->getResultArray();
        $row['_related'] = $db->table('announcement_related')
            ->where('announcement_id', $id)
            ->orderBy('sort_order', 'ASC')
            ->get()
            ->getResultArray();
        $row['_labeled_rows'] = $db->table('announcement_labeled_rows')
            ->where('announcement_id', $id)
            ->orderBy('sort_order', 'ASC')
            ->get()
            ->getResultArray();

        return $row;
    }
}
