<?php
declare(strict_types=1);

namespace App\Libraries\Sgx;

use DateTimeImmutable;
use DateTimeZone;

final class AnnouncementPresenter
{
    private const SGT = 'Asia/Singapore';

    private const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    /**
     * @param array<string, mixed> $row
     * @return array<string, mixed>
     */
    public static function fromRow(array $row): array
    {
        $title = (string) ($row['title'] ?? '');
        $category = (string) ($row['category'] ?? '');

        return [
            'id' => $row['id'] ?? null,
            'title' => $row['title'] ?? null,
            'title_btn' => self::overrideOr($row['title_btn'] ?? null, LayoutTitleDeriver::btnFromTitle($title)),
            'title_btn_sm' => self::overrideOr($row['title_btn_sm'] ?? null, $title),
            'title_banner' => self::overrideOr($row['title_banner'] ?? null, LayoutTitleDeriver::bannerFromCategory($category)),
            'slug' => $row['slug'] ?? null,
            'desc' => (string) ($row['summary'] ?? ''),
            'date' => self::formatFiledAt($row['filed_at'] ?? null),
            'details' => self::details($row),
            'category' => $row['category'] ?? null,
        ];
    }

    /**
     * @param array<string, mixed> $row
     * @return array<string, mixed>
     */
    private static function details(array $row): array
    {
        $details = [];

        $issuer = self::nonEmptyString($row['issuer_name'] ?? null) ?? self::nonEmptyString($row['issuer'] ?? null);
        if ($issuer !== null) {
            $details['issuer'] = ['name' => $issuer];
        }

        $securities = self::nonEmptyString($row['securities_name'] ?? null);
        if ($securities !== null) {
            $details['securities'] = ['name' => $securities];
        }

        $stapled = self::nonEmptyString($row['stapled_security_name'] ?? null);
        if ($stapled !== null) {
            $details['stapledSecurity'] = ['name' => $stapled];
        }

        $details['announcement'] = self::announcementBlock($row);

        $additional = self::additional($row);
        if ($additional !== []) {
            $details['additional'] = $additional;
        }

        $attachments = self::namedUrlList($row['_attachments'] ?? []);
        if ($attachments !== []) {
            $details['attachments'] = $attachments;
        }

        $related = self::relatedList($row['_related'] ?? []);
        if ($related !== []) {
            $details['related'] = $related;
        }

        $labeled = self::groupLabeledRows(is_array($row['_labeled_rows'] ?? null) ? $row['_labeled_rows'] : []);

        $eventNarrative = self::nameTextList($labeled['event_narrative'] ?? []);
        if ($eventNarrative !== []) {
            $details['eventNarrative'] = $eventNarrative;
        }

        $eventDates = [];
        $leftDates = self::nameTextList($labeled['event_date_left'] ?? []);
        if ($leftDates !== []) {
            $eventDates['left'] = $leftDates;
        }
        $rightDates = self::nameTextList($labeled['event_date_right'] ?? []);
        if ($rightDates !== []) {
            $eventDates['right'] = $rightDates;
        }
        if ($eventDates !== []) {
            $details['eventDates'] = $eventDates;
        }

        $venues = self::nameTextList($labeled['event_venue'] ?? []);
        if ($venues !== []) {
            $details['eventVenues'] = $venues;
        }

        return $details;
    }

    /**
     * @param array<string, mixed> $row
     * @return array<string, mixed>
     */
    private static function announcementBlock(array $row): array
    {
        $block = [];
        self::putIfPresent($block, 'subTitle', $row['ann_subtitle'] ?? null);
        self::putIfPresent($block, 'title', $row['ann_title'] ?? null);
        self::putIfPresent($block, 'dateTime', $row['ann_datetime'] ?? null);
        self::putIfPresent($block, 'status', $row['ann_status'] ?? null);
        $block['reference'] = self::nonEmptyString($row['ann_reference'] ?? null)
            ?? self::nonEmptyString($row['sgx_reference'] ?? null)
            ?? '';
        self::putIfPresent($block, 'submittedBy', $row['ann_submitted_by'] ?? null);
        self::putIfPresent($block, 'designation', $row['ann_designation'] ?? null);
        self::putIfPresent($block, 'description', $row['ann_description'] ?? null);
        self::putIfPresent($block, 'disclaimer', $row['ann_disclaimer'] ?? null);
        self::putIfPresent($block, 'effectiveStartDate', $row['ann_effective_start_date'] ?? null);
        self::putIfPresent($block, 'reportType', $row['ann_report_type'] ?? null);
        self::putIfPresent($block, 'finalYearEnd', $row['ann_final_year_end'] ?? null);

        return $block;
    }

    /**
     * @param array<string, mixed> $row
     * @return array<string, mixed>
     */
    private static function additional(array $row): array
    {
        $labeled = self::groupLabeledRows(is_array($row['_labeled_rows'] ?? null) ? $row['_labeled_rows'] : []);
        $out = [];

        self::putIfPresent($out, 'description', $row['addl_description'] ?? null);
        self::putIfPresent($out, 'name', $row['addl_name'] ?? null);
        self::putIfPresent($out, 'age', $row['addl_age'] ?? null);
        self::putIfPresent($out, 'dateCessationKnown', $row['addl_date_cessation_known'] ?? null);
        self::putIfPresent($out, 'dateOfAppointment', $row['addl_date_of_appointment'] ?? null);
        self::putIfPresent($out, 'dateCessation', $row['addl_date_cessation'] ?? null);
        self::putIfPresent($out, 'countryOfPrincipalResidence', $row['addl_country_of_principal_residence'] ?? null);

        $left = self::nameTextList($labeled['additional_left'] ?? []);
        if ($left !== []) {
            $out['left'] = $left;
        }
        $right = self::nameTextList($labeled['additional_right'] ?? []);
        if ($right !== []) {
            $out['right'] = $right;
        }
        $rowItems = self::nameTextList($labeled['additional_row'] ?? []);
        if ($rowItems !== []) {
            $out['rowItems'] = $rowItems;
        }

        $directorships = [];
        foreach ($labeled['other_directorship'] ?? [] as $item) {
            $name = (string) ($item['name'] ?? '');
            $text = (string) ($item['text'] ?? '');
            if ($name === '' && $text === '') {
                continue;
            }
            $details = $text === '' ? [] : (preg_split("/\r\n|\n|\r/", $text) ?: []);
            $directorships[] = ['name' => $name, 'details' => $details];
        }
        if ($directorships !== []) {
            $out['otherDirectorships'] = $directorships;
        }

        return $out;
    }

    /**
     * @param mixed $rows
     * @return list<array{name: string, url: string}>
     */
    private static function namedUrlList(mixed $rows): array
    {
        if (! is_array($rows)) {
            return [];
        }
        $out = [];
        foreach ($rows as $item) {
            if (! is_array($item)) {
                continue;
            }
            $name = (string) ($item['name'] ?? '');
            $url = (string) ($item['url'] ?? '');
            if ($name === '' && $url === '') {
                continue;
            }
            $out[] = ['name' => $name, 'url' => $url];
        }

        return $out;
    }

    /**
     * @param mixed $rows
     * @return list<array<string, string>>
     */
    private static function relatedList(mixed $rows): array
    {
        if (! is_array($rows)) {
            return [];
        }
        $out = [];
        foreach ($rows as $item) {
            if (! is_array($item)) {
                continue;
            }
            $entry = [
                'name' => (string) ($item['name'] ?? ''),
                'text' => (string) ($item['text'] ?? ''),
                'url' => (string) ($item['url'] ?? ''),
            ];
            if ($entry['name'] === '' && $entry['text'] === '' && $entry['url'] === '') {
                continue;
            }
            $out[] = $entry;
        }

        return $out;
    }

    /**
     * @param list<array<string, mixed>> $rows
     * @return list<array{name: string, text: string}>
     */
    private static function nameTextList(array $rows): array
    {
        $out = [];
        foreach ($rows as $item) {
            $out[] = [
                'name' => (string) ($item['name'] ?? ''),
                'text' => (string) ($item['text'] ?? ''),
            ];
        }

        return $out;
    }

    /**
     * @param list<array<string, mixed>> $rows
     * @return array<string, list<array<string, mixed>>>
     */
    private static function groupLabeledRows(array $rows): array
    {
        usort($rows, static fn (array $a, array $b): int => ((int) ($a['sort_order'] ?? 0)) <=> ((int) ($b['sort_order'] ?? 0)));
        $grouped = [];
        foreach ($rows as $item) {
            $section = (string) ($item['section'] ?? '');
            if ($section === '') {
                continue;
            }
            $grouped[$section][] = $item;
        }

        return $grouped;
    }

    private static function overrideOr(mixed $override, string $derived): string
    {
        $value = self::nonEmptyString($override);

        return $value ?? $derived;
    }

    private static function nonEmptyString(mixed $value): ?string
    {
        if ($value === null) {
            return null;
        }
        $s = (string) $value;

        return $s === '' ? null : $s;
    }

    /** @param array<string, mixed> $target */
    private static function putIfPresent(array &$target, string $key, mixed $value): void
    {
        $s = self::nonEmptyString($value);
        if ($s !== null) {
            $target[$key] = $s;
        }
    }

    /** Match FE formatFiledAt (Asia/Singapore display). */
    private static function formatFiledAt(mixed $value): string
    {
        if ($value === null || $value === '') {
            return '';
        }

        $raw = (string) $value;
        $sgt = new DateTimeZone(self::SGT);
        $normalized = preg_replace(
            '/^(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2})([+-]\d{2}:\d{2}|Z)?$/',
            '$1T$2$3',
            $raw
        ) ?? $raw;
        $dt = DateTimeImmutable::createFromFormat('Y-m-d H:i:s', $raw, $sgt)
            ?: date_create_immutable($normalized);
        if ($dt === false) {
            return '';
        }

        $dt = $dt->setTimezone($sgt);
        $month = self::MONTHS[(int) $dt->format('n') - 1];

        // Pad hour to match announcements.json (`09:54 AM`, not `9:54 AM`).
        return sprintf(
            '%s %s %s %s:%s %s',
            $dt->format('d'),
            $month,
            $dt->format('Y'),
            $dt->format('h'),
            $dt->format('i'),
            $dt->format('A')
        );
    }
}
