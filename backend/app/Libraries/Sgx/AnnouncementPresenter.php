<?php
declare(strict_types=1);

namespace App\Libraries\Sgx;

use DateTimeImmutable;
use DateTimeZone;

final class AnnouncementPresenter
{
    private const SGT = 'Asia/Singapore';

    /**
     * @param array<string, mixed> $row
     * @return array<string, mixed>
     */
    public static function fromRow(array $row): array
    {
        return [
            'id' => $row['id'] ?? null,
            'slug' => $row['slug'] ?? null,
            'title' => $row['title'] ?? null,
            'category' => $row['category'] ?? null,
            'issuer' => $row['issuer'] ?? null,
            'filed_at' => self::iso8601Sgt($row['filed_at'] ?? null),
            'source_url' => $row['source_url'] ?? null,
            'summary' => $row['summary'] ?? null,
            'published_at' => self::iso8601Sgt($row['published_at'] ?? null),
        ];
    }

    private static function iso8601Sgt(mixed $value): ?string
    {
        if ($value === null || $value === '') {
            return null;
        }

        $raw = (string) $value;
        $sgt = new DateTimeZone(self::SGT);
        $dt = DateTimeImmutable::createFromFormat('Y-m-d H:i:s', $raw, $sgt)
            ?: date_create_immutable($raw, $sgt);
        if ($dt === false) {
            return $raw;
        }

        return $dt->setTimezone($sgt)->format('Y-m-d\TH:i:sP');
    }
}
