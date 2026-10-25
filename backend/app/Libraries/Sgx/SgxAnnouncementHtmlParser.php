<?php
declare(strict_types=1);

namespace App\Libraries\Sgx;

/**
 * Parse links.sgx.com corporate-announcement HTML into FE-parity scalars + children.
 * Markup is server-rendered dl/dt/dd groups (Issuer, Announcement Details, Additional, Attachments).
 */
final class SgxAnnouncementHtmlParser
{
    private const DT_MAP = [
        'issuer/ manager' => 'issuer_name',
        'issuer/manager' => 'issuer_name',
        'securities' => 'securities_name',
        'stapled security' => 'stapled_security_name',
        'announcement title' => 'ann_title',
        'date &time of broadcast' => 'ann_datetime',
        'date & time of broadcast' => 'ann_datetime',
        'status' => 'ann_status',
        'announcement sub title' => 'ann_subtitle',
        'announcement reference' => 'ann_reference',
        'submitted by (co./ ind. name)' => 'ann_submitted_by',
        'submitted by (co./ind. name)' => 'ann_submitted_by',
        'designation' => 'ann_designation',
        'effective start date' => 'ann_effective_start_date',
        'report type' => 'ann_report_type',
        'financial year end' => 'ann_final_year_end',
        'final year end' => 'ann_final_year_end',
        'name of person' => 'addl_name',
        'age' => 'addl_age',
        'date of appointment' => 'addl_date_of_appointment',
        'date of cessation' => 'addl_date_cessation',
        'is cessation date known' => 'addl_date_cessation_known',
        'country of principal residence' => 'addl_country_of_principal_residence',
    ];

    /**
     * @return array{
     *   scalars: array<string, mixed>,
     *   attachments: list<array{name: ?string, url: ?string, sort_order: int}>,
     *   related: list<array<string, mixed>>,
     *   labeled_rows: list<array<string, mixed>>
     * }
     */
    public static function parse(string $html, string $pageUrl = 'https://links.sgx.com/'): array
    {
        $scalars = [];
        $attachments = [];
        $labeled = [];
        $related = [];

        $dom = new \DOMDocument();
        $prev = libxml_use_internal_errors(true);
        $dom->loadHTML('<?xml encoding="UTF-8">' . $html, LIBXML_NOWARNING | LIBXML_NOERROR);
        libxml_clear_errors();
        libxml_use_internal_errors($prev);

        $xpath = new \DOMXPath($dom);
        $base = self::origin($pageUrl);

        foreach ($xpath->query('//div[contains(@class,"announcement-group")]') as $group) {
            if (! $group instanceof \DOMElement) {
                continue;
            }
            $header = self::groupHeader($group);
            $section = self::sectionKey($header);

            if ($section === 'attachments') {
                foreach ($xpath->query('.//a[contains(@class,"announcement-attachment")]', $group) as $a) {
                    if (! $a instanceof \DOMElement) {
                        continue;
                    }
                    $name = self::cleanText($a->textContent);
                    $href = trim((string) $a->getAttribute('href'));
                    if ($name === '' || $href === '') {
                        continue;
                    }
                    $attachments[] = [
                        'name' => $name,
                        'url' => self::absoluteUrl($href, $base),
                        'sort_order' => count($attachments),
                    ];
                }
                continue;
            }

            foreach ($xpath->query('.//dt', $group) as $dt) {
                if (! $dt instanceof \DOMElement) {
                    continue;
                }
                $dd = $dt->nextElementSibling;
                while ($dd instanceof \DOMElement && strtolower($dd->tagName) !== 'dd') {
                    $dd = $dd->nextElementSibling;
                }
                if (! $dd instanceof \DOMElement) {
                    continue;
                }
                $label = self::normalizeLabel($dt->textContent);
                $value = self::ddValue($dd);
                if ($label === '' || $value === '') {
                    continue;
                }

                if (str_starts_with($label, 'description')) {
                    $scalars['ann_description'] = $value;
                    continue;
                }
                if (str_starts_with($label, 'disclaimer')) {
                    $scalars['ann_disclaimer'] = $value;
                    continue;
                }

                $field = self::DT_MAP[$label] ?? null;
                if ($field !== null) {
                    $scalars[$field] = $value;
                    continue;
                }

                if ($section === 'additional') {
                    if (str_starts_with($label, 'additional description') || $label === 'description') {
                        $scalars['addl_description'] = $value;
                        continue;
                    }
                    $labeled[] = [
                        'section' => 'additional_row',
                        'name' => self::cleanText($dt->textContent),
                        'text' => $value,
                        'sort_order' => count($labeled),
                    ];
                }
            }
        }

        return [
            'scalars' => $scalars,
            'attachments' => $attachments,
            'related' => $related,
            'labeled_rows' => $labeled,
        ];
    }

    private static function groupHeader(\DOMElement $group): string
    {
        $prev = $group->previousElementSibling;
        while ($prev instanceof \DOMElement) {
            if (str_contains((string) $prev->getAttribute('class'), 'announcement-group-header')) {
                return self::normalizeLabel($prev->textContent);
            }
            $prev = $prev->previousElementSibling;
        }

        return '';
    }

    private static function sectionKey(string $header): string
    {
        if (str_contains($header, 'attachment')) {
            return 'attachments';
        }
        if (str_contains($header, 'additional')) {
            return 'additional';
        }
        if (str_contains($header, 'related')) {
            return 'related';
        }

        return 'main';
    }

    private static function normalizeLabel(string $text): string
    {
        $text = html_entity_decode($text, ENT_QUOTES | ENT_HTML5, 'UTF-8');
        $text = strtolower(trim(preg_replace('/\s+/', ' ', $text) ?? ''));

        return rtrim($text, " \t.:");
    }

    private static function ddValue(\DOMElement $dd): string
    {
        $html = '';
        foreach ($dd->childNodes as $child) {
            $html .= $dd->ownerDocument?->saveHTML($child) ?? '';
        }
        $html = preg_replace('/<br\s*\/?>/i', "\n", $html) ?? $html;
        $text = html_entity_decode(strip_tags($html), ENT_QUOTES | ENT_HTML5, 'UTF-8');
        $text = preg_replace("/[ \t]+\n/", "\n", $text) ?? $text;
        $text = preg_replace("/\n{3,}/", "\n\n", $text) ?? $text;

        return trim($text);
    }

    private static function cleanText(string $text): string
    {
        $text = html_entity_decode($text, ENT_QUOTES | ENT_HTML5, 'UTF-8');

        return trim(preg_replace('/\s+/', ' ', $text) ?? '');
    }

    private static function origin(string $pageUrl): string
    {
        $parts = parse_url($pageUrl);
        if (! is_array($parts) || empty($parts['scheme']) || empty($parts['host'])) {
            return 'https://links.sgx.com';
        }

        return $parts['scheme'] . '://' . $parts['host'];
    }

    private static function absoluteUrl(string $href, string $origin): string
    {
        if (preg_match('#^https?://#i', $href) === 1) {
            return $href;
        }
        if (str_starts_with($href, '//')) {
            return 'https:' . $href;
        }
        if (str_starts_with($href, '/')) {
            return $origin . $href;
        }

        return rtrim($origin, '/') . '/' . ltrim($href, '/');
    }
}
