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
        return [
            'id' => $row['id'] ?? null,
            'slug' => $row['slug'] ?? null,
            'title' => $row['title'] ?? null,
            'category' => $row['category'] ?? null,
            'issuer' => $row['issuer'] ?? null,
            'filed_at' => $row['filed_at'] ?? null,
            'source_url' => $row['source_url'] ?? null,
            'summary' => $row['summary'] ?? null,
            'published_at' => $row['published_at'] ?? null,
        ];
    }
}
