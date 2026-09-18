<?php
declare(strict_types=1);

namespace App\Libraries\Sgx;

final class AnnouncementNormalizer
{
    private const MONTHS = [
        'Jan' => 1, 'Feb' => 2, 'Mar' => 3, 'Apr' => 4, 'May' => 5, 'Jun' => 6,
        'Jul' => 7, 'Aug' => 8, 'Sep' => 9, 'Oct' => 10, 'Nov' => 11, 'Dec' => 12,
    ];

    /** @param array<string, mixed> $item */
    public function normalize(array $item): array
    {
        $details = is_array($item['details'] ?? null) ? $item['details'] : [];
        $ann = is_array($details['announcement'] ?? null) ? $details['announcement'] : [];
        $reference = (string) ($ann['reference'] ?? '');
        if ($reference === '') {
            throw new \InvalidArgumentException('Missing SGX reference');
        }

        $rawTitle = (string) ($ann['subTitle'] ?? '');
        if ($rawTitle === '') {
            $rawTitle = str_replace('::', ' - ', (string) ($item['title'] ?? 'Untitled'));
        }

        $category = (string) ($item['category'] ?? 'General Announcement');
        if ($category === '') {
            $category = 'General Announcement';
        }

        $slug = $this->slugify($category . '-' . $rawTitle . '-' . $reference);
        $payload = json_encode($item, JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE);

        return [
            'sgx_reference' => $reference,
            'slug' => $slug,
            'source_url' => (string) ($item['url'] ?? ''),
            'title' => $rawTitle,
            'category' => $category,
            'issuer' => (string) ($ann['submittedBy'] ?? ''),
            'filed_at' => $this->parseFiledAt((string) ($item['date'] ?? '')),
            'source_payload' => $payload,
        ];
    }

    private function slugify(string $value): string
    {
        $value = strtolower($value);
        $value = preg_replace('/[^a-z0-9]+/', '-', $value) ?? '';
        $value = trim($value, '-') ?: 'announcement';

        return substr($value, 0, 191);
    }

    private function parseFiledAt(string $value): string
    {
        if (preg_match('/^(\d{1,2})\s([A-Za-z]{3})\s(\d{4})\s(\d{1,2}):(\d{2})\s(AM|PM)$/i', $value, $m)) {
            $month = self::MONTHS[$m[2]] ?? null;
            if ($month === null) {
                throw new \InvalidArgumentException("Bad month in date: {$value}");
            }
            $hour = (int) $m[4];
            $minute = (int) $m[5];
            $mer = strtoupper($m[6]);
            if ($mer === 'AM' && $hour === 12) {
                $hour = 0;
            }
            if ($mer === 'PM' && $hour < 12) {
                $hour += 12;
            }

            return sprintf(
                '%04d-%02d-%02d %02d:%02d:00',
                (int) $m[3],
                $month,
                (int) $m[1],
                $hour,
                $minute
            );
        }
        $sgt = new \DateTimeZone('Asia/Singapore');
        $dt = date_create_immutable($value, $sgt);
        if ($dt === false) {
            throw new \InvalidArgumentException("Unparseable date: {$value}");
        }

        return $dt->setTimezone($sgt)->format('Y-m-d H:i:s');
    }
}
