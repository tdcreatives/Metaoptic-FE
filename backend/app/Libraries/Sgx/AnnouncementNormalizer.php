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
        // Real api.sgx.com list shape (preferred) or legacy nested fixture shape.
        if (isset($item['ref_id'])) {
            $reference = (string) $item['ref_id'];
            $rawTitle = $this->titleFromApi((string) ($item['title'] ?? ''));
            $category = (string) ($item['category_name'] ?? 'General Announcement');
            $issuer = (string) ($item['submitted_by'] ?? $item['issuer_name'] ?? '');
            $sourceUrl = $this->httpUrl((string) ($item['url'] ?? ''));
            $filedAt = $this->parseFiledAtFromApi($item);
        } else {
            $details = is_array($item['details'] ?? null) ? $item['details'] : [];
            $ann = is_array($details['announcement'] ?? null) ? $details['announcement'] : [];
            $reference = (string) ($ann['reference'] ?? '');
            $rawTitle = (string) ($ann['subTitle'] ?? '');
            if ($rawTitle === '') {
                $rawTitle = str_replace('::', ' - ', (string) ($item['title'] ?? 'Untitled'));
            }
            $category = (string) ($item['category'] ?? 'General Announcement');
            $issuer = (string) ($ann['submittedBy'] ?? '');
            $sourceUrl = $this->httpUrl((string) ($item['url'] ?? ''));
            $filedAt = $this->parseFiledAt((string) ($item['date'] ?? ''));
        }

        if ($reference === '') {
            throw new \InvalidArgumentException('Missing SGX reference');
        }
        if ($category === '') {
            $category = 'General Announcement';
        }
        if ($rawTitle === '') {
            $rawTitle = 'Untitled';
        }

        $slug = $this->slugify($category . '-' . $rawTitle . '-' . $reference);
        $payload = json_encode($item, JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE);

        $row = [
            'sgx_reference' => $reference,
            'slug' => $slug,
            'source_url' => $sourceUrl,
            'title' => $rawTitle,
            'category' => $category,
            'issuer' => $issuer,
            'filed_at' => $filedAt,
            'source_payload' => $payload,
        ];

        if (isset($item['ref_id'])) {
            // Flat list API: map every FE scalar the list payload actually carries.
            // Never emit _attachments/_related/_labeled_rows — empty children would wipe CMS edits.
            $row = array_merge($row, $this->feScalarsFromFlatList($item, $reference, $category, $rawTitle, $filedAt));
        } elseif (is_array($item['details'] ?? null)) {
            $mapped = LegacyDetailMapper::fromNested($item, $item['details']);
            $row = array_merge($row, $mapped['scalars'], [
                '_attachments' => $mapped['attachments'],
                '_related' => $mapped['related'],
                '_labeled_rows' => $mapped['labeled_rows'],
            ]);
        }

        return $row;
    }

    /**
     * List-derived FE fields only (api.sgx.com /company). Rich description/attachments stay null until
     * JSON import or admin edit — those are not on the list endpoint.
     *
     * @param array<string, mixed> $item
     * @return array<string, mixed>
     */
    private function feScalarsFromFlatList(
        array $item,
        string $reference,
        string $category,
        string $rawTitle,
        string $filedAt,
    ): array {
        $issuerName = trim((string) ($item['issuer_name'] ?? ''));
        $securities = trim((string) ($item['security_name'] ?? ''));
        $submittedBy = trim((string) ($item['submitted_by'] ?? ''));

        return [
            'issuer_name' => $issuerName !== '' ? $issuerName : null,
            'securities_name' => $securities !== '' ? $securities : null,
            'ann_title' => $category !== '' ? $category : null,
            'ann_subtitle' => $rawTitle !== '' && $rawTitle !== 'Untitled' ? $rawTitle : null,
            'ann_datetime' => $this->formatAnnDatetime($filedAt),
            'ann_reference' => $reference !== '' ? $reference : null,
            'ann_submitted_by' => $submittedBy !== '' ? $submittedBy : null,
        ];
    }

    /** FE announcement.dateTime style, e.g. 15-Sep-2025 09:30:00 */
    private function formatAnnDatetime(string $filedAt): ?string
    {
        $dt = date_create_immutable($filedAt, new \DateTimeZone('Asia/Singapore'));
        if ($dt === false) {
            return null;
        }

        return $dt->format('d-M-Y H:i:s');
    }

    private function titleFromApi(string $title): string
    {
        if ($title === '') {
            return '';
        }
        if (str_contains($title, '::')) {
            $parts = explode('::', $title, 2);
            $after = trim($parts[1]);

            return $after !== '' ? $after : trim($parts[0]);
        }

        return $title;
    }

    /** @param array<string, mixed> $item */
    private function parseFiledAtFromApi(array $item): string
    {
        if (isset($item['broadcast_date_time']) && is_numeric($item['broadcast_date_time'])) {
            $seconds = intdiv((int) $item['broadcast_date_time'], 1000);
            $dt = (new \DateTimeImmutable('@' . $seconds))
                ->setTimezone(new \DateTimeZone('Asia/Singapore'));

            return $dt->format('Y-m-d H:i:s');
        }

        return $this->parseFiledAt((string) ($item['date'] ?? ''));
    }

    private function httpUrl(string $url): string
    {
        if ($url === '') {
            return '';
        }
        $scheme = strtolower((string) (parse_url($url, PHP_URL_SCHEME) ?? ''));
        if ($scheme !== 'http' && $scheme !== 'https') {
            throw new \InvalidArgumentException('Invalid source_url scheme');
        }

        return $url;
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
