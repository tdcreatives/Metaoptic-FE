<?php
declare(strict_types=1);

namespace App\Libraries\Sgx;

final class AnnouncementPresenter
{
    /**
     * @param array<string, mixed> $row
     * @return array<string, mixed>
     */
    public static function fromRow(array $row): array
    {
        unset($row['source_payload'], $row['source_hash'], $row['needs_review']);

        return $row;
    }
}
