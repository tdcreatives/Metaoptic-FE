<?php
declare(strict_types=1);

namespace App\Libraries\Sgx;

/**
 * Nested announcements.json `details` → scalars + child rows.
 * Shared by JsonAnnouncementImporter and AnnouncementNormalizer.
 */
final class LegacyDetailMapper
{
    /**
     * @param array<string, mixed> $item
     * @param array<string, mixed> $details
     * @return array{
     *   scalars: array<string, mixed>,
     *   attachments: list<array<string, mixed>>,
     *   related: list<array<string, mixed>>,
     *   labeled_rows: list<array<string, mixed>>
     * }
     */
    public static function fromNested(array $item, array $details, bool $includeLayout = true): array
    {
        $ann = is_array($details['announcement'] ?? null) ? $details['announcement'] : [];
        $additional = is_array($details['additional'] ?? null) ? $details['additional'] : [];
        $reference = trim((string) ($ann['reference'] ?? ''));
        $issuerName = self::nestedName($details['issuer'] ?? null);

        $scalars = [
            'issuer_name' => $issuerName,
            'securities_name' => self::nestedName($details['securities'] ?? null),
            'stapled_security_name' => self::nestedName($details['stapledSecurity'] ?? null),
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
        ];
        if ($includeLayout) {
            foreach (['title_btn', 'title_btn_sm', 'title_banner'] as $key) {
                if (array_key_exists($key, $item)) {
                    $scalars[$key] = $item[$key];
                }
            }
        }

        return [
            'scalars' => $scalars,
            'attachments' => self::mapNameUrl($details['attachments'] ?? []),
            'related' => self::mapRelated($details['related'] ?? []),
            'labeled_rows' => self::mapLabeledRows($details),
        ];
    }

    /** @param mixed $block */
    public static function nestedName(mixed $block): ?string
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
    public static function mapNameUrl(mixed $items): array
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
    public static function mapRelated(mixed $items): array
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
    public static function mapLabeledRows(array $details): array
    {
        $rows = [];
        $additional = is_array($details['additional'] ?? null) ? $details['additional'] : [];
        self::appendNameText($rows, 'additional_left', $additional['left'] ?? []);
        self::appendNameText($rows, 'additional_right', $additional['right'] ?? []);
        self::appendNameText($rows, 'additional_row', $additional['rowItems'] ?? []);
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
        self::appendNameText($rows, 'event_narrative', $details['eventNarrative'] ?? []);
        $eventDates = is_array($details['eventDates'] ?? null) ? $details['eventDates'] : [];
        self::appendNameText($rows, 'event_date_left', $eventDates['left'] ?? []);
        self::appendNameText($rows, 'event_date_right', $eventDates['right'] ?? []);
        self::appendNameText($rows, 'event_venue', $details['eventVenues'] ?? []);

        return $rows;
    }

    /**
     * @param list<array<string, mixed>> $rows
     * @param mixed $items
     */
    private static function appendNameText(array &$rows, string $section, mixed $items): void
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
}
