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

        // Flat SGX list (ref_id) is core-only — never emit empty detail keys that would wipe FE children.
        if (! isset($item['ref_id']) && is_array($item['details'] ?? null)) {
            $row = array_merge($row, $this->detailsFromNested($item, $item['details']));
        }

        return $row;
    }

    /**
     * @param array<string, mixed> $item
     * @param array<string, mixed> $details
     * @return array<string, mixed>
     */
    private function detailsFromNested(array $item, array $details): array
    {
        $ann = is_array($details['announcement'] ?? null) ? $details['announcement'] : [];
        $additional = is_array($details['additional'] ?? null) ? $details['additional'] : [];
        $reference = (string) ($ann['reference'] ?? '');
        $issuerName = $this->nestedName($details['issuer'] ?? null);

        $scalars = [
            'issuer_name' => $issuerName,
            'securities_name' => $this->nestedName($details['securities'] ?? null),
            'stapled_security_name' => $this->nestedName($details['stapledSecurity'] ?? null),
            'ann_title' => $ann['title'] ?? null,
            'ann_subtitle' => $ann['subTitle'] ?? null,
            'ann_datetime' => $ann['dateTime'] ?? null,
            'ann_status' => $ann['status'] ?? null,
            'ann_reference' => $reference !== '' ? $reference : null,
            'ann_submitted_by' => $ann['submittedBy'] ?? null,
            'ann_designation' => $ann['designation'] ?? null,
            'ann_description' => $ann['description'] ?? null,
            'ann_disclaimer' => $ann['disclaimer'] ?? null,
            'ann_effective_start_date' => $ann['effectiveStartDate'] ?? null,
            'ann_report_type' => $ann['reportType'] ?? null,
            'ann_final_year_end' => $ann['finalYearEnd'] ?? null,
            'addl_description' => $additional['description'] ?? null,
            'addl_name' => $additional['name'] ?? null,
            'addl_age' => $additional['age'] ?? null,
            'addl_date_cessation_known' => $additional['dateCessationKnown'] ?? null,
            'addl_date_of_appointment' => $additional['dateOfAppointment'] ?? null,
            'addl_date_cessation' => $additional['dateCessation'] ?? null,
            'addl_country_of_principal_residence' => $additional['countryOfPrincipalResidence'] ?? null,
            '_attachments' => $this->mapNameUrl($details['attachments'] ?? []),
            '_related' => $this->mapRelated($details['related'] ?? []),
            '_labeled_rows' => $this->mapLabeledRows($details),
        ];
        foreach (['title_btn', 'title_btn_sm', 'title_banner'] as $key) {
            if (array_key_exists($key, $item)) {
                $scalars[$key] = $item[$key];
            }
        }

        return $scalars;
    }

    /** @param mixed $block */
    private function nestedName(mixed $block): ?string
    {
        if (! is_array($block)) {
            return null;
        }
        $name = $block['name'] ?? null;

        return $name === null || $name === '' ? null : (string) $name;
    }

    /**
     * @param mixed $items
     * @return list<array<string, mixed>>
     */
    private function mapNameUrl(mixed $items): array
    {
        $rows = [];
        if (! is_array($items)) {
            return $rows;
        }
        foreach ($items as $i => $row) {
            if (! is_array($row)) {
                continue;
            }
            $rows[] = [
                'name' => $row['name'] ?? null,
                'url' => $row['url'] ?? null,
                'sort_order' => $i,
            ];
        }

        return $rows;
    }

    /**
     * @param mixed $items
     * @return list<array<string, mixed>>
     */
    private function mapRelated(mixed $items): array
    {
        $rows = [];
        if (! is_array($items)) {
            return $rows;
        }
        foreach ($items as $i => $row) {
            if (! is_array($row)) {
                continue;
            }
            $rows[] = [
                'name' => $row['name'] ?? null,
                'text' => $row['text'] ?? null,
                'url' => $row['url'] ?? null,
                'sort_order' => $i,
            ];
        }

        return $rows;
    }

    /**
     * @param array<string, mixed> $details
     * @return list<array<string, mixed>>
     */
    private function mapLabeledRows(array $details): array
    {
        $rows = [];
        $additional = is_array($details['additional'] ?? null) ? $details['additional'] : [];
        $this->appendNameText($rows, 'additional_left', $additional['left'] ?? []);
        $this->appendNameText($rows, 'additional_right', $additional['right'] ?? []);
        $this->appendNameText($rows, 'additional_row', $additional['rowItems'] ?? []);
        foreach ($additional['otherDirectorships'] ?? [] as $row) {
            if (! is_array($row)) {
                continue;
            }
            $detailsList = $row['details'] ?? [];
            $text = is_array($detailsList)
                ? implode("\n", array_map(static fn ($v) => (string) $v, $detailsList))
                : (string) $detailsList;
            $rows[] = [
                'section' => 'other_directorship',
                'name' => $row['name'] ?? null,
                'text' => $text,
                'sort_order' => count($rows),
            ];
        }
        $this->appendNameText($rows, 'event_narrative', $details['eventNarrative'] ?? []);
        $eventDates = is_array($details['eventDates'] ?? null) ? $details['eventDates'] : [];
        $this->appendNameText($rows, 'event_date_left', $eventDates['left'] ?? []);
        $this->appendNameText($rows, 'event_date_right', $eventDates['right'] ?? []);
        $this->appendNameText($rows, 'event_venue', $details['eventVenues'] ?? []);

        return $rows;
    }

    /**
     * @param list<array<string, mixed>> $rows
     * @param mixed $items
     */
    private function appendNameText(array &$rows, string $section, mixed $items): void
    {
        if (! is_array($items)) {
            return;
        }
        foreach ($items as $row) {
            if (! is_array($row)) {
                continue;
            }
            $rows[] = [
                'section' => $section,
                'name' => $row['name'] ?? null,
                'text' => $row['text'] ?? null,
                'sort_order' => count($rows),
            ];
        }
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
