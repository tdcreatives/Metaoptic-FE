<?php
declare(strict_types=1);

namespace App\Libraries\Admin;

use App\Libraries\Sgx\SourceHasher;
use App\Models\AnnouncementModel;
use CodeIgniter\Database\BaseConnection;
use DateTimeImmutable;
use DateTimeZone;
use InvalidArgumentException;
use RuntimeException;

final class JsonAnnouncementImporter
{
    private const SGT = 'Asia/Singapore';
    private const DATE_FORMAT = 'd M Y h:i A';

    public function __construct(private readonly BaseConnection $db)
    {
    }

    /**
     * @return array{inserted: int, updated: int}
     */
    public function import(string $absolutePath): array
    {
        if (! is_file($absolutePath) || ! is_readable($absolutePath)) {
            throw new InvalidArgumentException('JSON file not found: ' . $absolutePath);
        }

        $decoded = json_decode((string) file_get_contents($absolutePath), true, 512, JSON_THROW_ON_ERROR);
        if (! is_array($decoded) || $decoded === [] || ! array_is_list($decoded)) {
            throw new InvalidArgumentException('JSON must be an array of announcement objects');
        }

        $model = new AnnouncementModel($this->db);
        $writer = new AnnouncementDetailWriter($this->db);
        $hasher = new SourceHasher();
        $now = (new DateTimeImmutable('now', new DateTimeZone(self::SGT)))->format('Y-m-d H:i:s');
        $inserted = 0;
        $updated = 0;

        $this->db->transException(true);
        $this->db->transStart();

        foreach ($decoded as $i => $item) {
            if (! is_array($item)) {
                throw new InvalidArgumentException('JSON item is not an object at index ' . $i);
            }
            $slug = trim((string) ($item['slug'] ?? ''));
            if ($slug === '') {
                throw new InvalidArgumentException('JSON item missing slug at index ' . $i);
            }

            $payload = json_encode($item, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
            if ($payload === false) {
                throw new RuntimeException('Failed to encode source_payload for slug ' . $slug);
            }

            $details = is_array($item['details'] ?? null) ? $item['details'] : [];
            $ann = is_array($details['announcement'] ?? null) ? $details['announcement'] : [];
            $reference = trim((string) ($ann['reference'] ?? ''));
            $issuerName = $this->nestedName($details['issuer'] ?? null);

            $core = [
                'slug' => $slug,
                'title' => (string) ($item['title'] ?? ''),
                'category' => (string) ($item['category'] ?? 'General Announcement'),
                'issuer' => $issuerName ?? '',
                'filed_at' => $this->parseDate((string) ($item['date'] ?? '')),
                'summary' => (string) ($item['desc'] ?? ''),
                'source_url' => $this->sourceUrl($details),
                'source_payload' => $payload,
                'source_hash' => $hasher->hash($payload),
                'source' => $reference !== '' ? 'sgx' : 'manual',
                'sgx_reference' => $this->sgxReferenceIfUnused($model, $slug, $reference),
                'state' => 'published',
                'needs_review' => 0,
            ];

            $existing = $model->where('slug', $slug)->first();
            if ($existing === null) {
                $core['published_at'] = $now;
                $model->insert($core);
                $id = (int) $model->getInsertID();
                $inserted++;
            } else {
                $id = (int) $existing['id'];
                if (($existing['published_at'] ?? null) === null || $existing['published_at'] === '') {
                    $core['published_at'] = $now;
                }
                $model->update($id, $core);
                $updated++;
            }

            $writer->replace(
                $id,
                $this->scalars($item, $details, $ann, $issuerName, $reference),
                $this->attachments($details),
                $this->related($details),
                $this->labeledRows($details),
            );
        }

        $this->db->transComplete();
        if ($this->db->transStatus() === false) {
            throw new RuntimeException('announcement JSON import failed');
        }

        return ['inserted' => $inserted, 'updated' => $updated];
    }

    /**
     * @param array<string, mixed> $item
     * @param array<string, mixed> $details
     * @param array<string, mixed> $ann
     * @return array<string, mixed>
     */
    private function scalars(array $item, array $details, array $ann, ?string $issuerName, string $reference): array
    {
        $additional = is_array($details['additional'] ?? null) ? $details['additional'] : [];
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
        ];
        foreach (['title_btn', 'title_btn_sm', 'title_banner'] as $key) {
            if (array_key_exists($key, $item)) {
                $scalars[$key] = $item[$key];
            }
        }

        return $scalars;
    }

    /**
     * @param array<string, mixed> $details
     * @return list<array<string, mixed>>
     */
    private function attachments(array $details): array
    {
        $rows = [];
        foreach ($details['attachments'] ?? [] as $i => $row) {
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
     * @param array<string, mixed> $details
     * @return list<array<string, mixed>>
     */
    private function related(array $details): array
    {
        $rows = [];
        foreach ($details['related'] ?? [] as $i => $row) {
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
    private function labeledRows(array $details): array
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
            $text = is_array($detailsList) ? implode("\n", array_map(static fn ($v) => (string) $v, $detailsList)) : (string) $detailsList;
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

    /** @param mixed $block */
    private function nestedName(mixed $block): ?string
    {
        if (! is_array($block)) {
            return null;
        }
        $name = $block['name'] ?? null;

        return $name === null || $name === '' ? null : (string) $name;
    }

    /** @param array<string, mixed> $details */
    private function sourceUrl(array $details): string
    {
        foreach ($details['attachments'] ?? [] as $row) {
            if (! is_array($row)) {
                continue;
            }
            $url = (string) ($row['url'] ?? '');
            if (str_starts_with($url, 'http://') || str_starts_with($url, 'https://')) {
                return $url;
            }
        }

        return '';
    }

    /**
     * UNIQUE sgx_reference: first slug to claim a ref keeps it; later slugs still import with NULL.
     * Live announcements.json has duplicate details.announcement.reference values.
     */
    private function sgxReferenceIfUnused(AnnouncementModel $model, string $slug, string $reference): ?string
    {
        if ($reference === '') {
            return null;
        }
        $owner = $model->where('sgx_reference', $reference)->first();
        if ($owner !== null && (string) $owner['slug'] !== $slug) {
            return null;
        }

        return $reference;
    }

    private function parseDate(string $date): string
    {
        $sgt = new DateTimeZone(self::SGT);
        $dt = DateTimeImmutable::createFromFormat('!' . self::DATE_FORMAT, $date, $sgt);
        if ($dt === false) {
            throw new InvalidArgumentException('Unparseable announcement date: ' . $date);
        }

        return $dt->format('Y-m-d H:i:s');
    }
}
