<?php
declare(strict_types=1);

namespace App\Libraries\Admin;

use App\Libraries\Sgx\LegacyDetailMapper;
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
     * @return array{inserted: int, updated: int, skipped_refs: list<array{slug: string, reference: string}>}
     */
    public function import(string $absolutePath, bool $force = false): array
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
        $skippedRefs = [];

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
            $issuerName = LegacyDetailMapper::nestedName($details['issuer'] ?? null);
            $sgxRef = $this->sgxReferenceIfUnused($model, $slug, $reference);
            if ($reference !== '' && $sgxRef === null) {
                $skippedRefs[] = ['slug' => $slug, 'reference' => $reference];
            }

            $core = [
                'slug' => $slug,
                'title' => (string) ($item['title'] ?? ''),
                'category' => (string) ($item['category'] ?? 'General Announcement'),
                'issuer' => $issuerName ?? '',
                'filed_at' => $this->parseDate((string) ($item['date'] ?? '')),
                'source_url' => $this->sourceUrl($details),
                'source_payload' => $payload,
                'source_hash' => $hasher->hash($payload),
                'source' => $reference !== '' ? 'sgx' : 'manual',
                'sgx_reference' => $sgxRef,
            ];

            $existing = $model->where('slug', $slug)->first();
            $isInsert = $existing === null;
            $writeLayout = $isInsert || $force;
            if ($isInsert || $force) {
                $core['summary'] = (string) ($item['desc'] ?? '');
                $core['state'] = 'published';
                $core['needs_review'] = 0;
            }

            $mapped = LegacyDetailMapper::fromNested($item, $details, $writeLayout);

            if ($isInsert) {
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
                $mapped['scalars'],
                $mapped['attachments'],
                $mapped['related'],
                $mapped['labeled_rows'],
            );
        }

        $this->db->transComplete();
        if ($this->db->transStatus() === false) {
            throw new RuntimeException('announcement JSON import failed');
        }

        service('auditLogger')->write('import_json', 'announcement', null, [
            'inserted' => $inserted,
            'updated' => $updated,
            'skipped_refs' => count($skippedRefs),
            'force' => $force,
        ]);

        return [
            'inserted' => $inserted,
            'updated' => $updated,
            'skipped_refs' => $skippedRefs,
        ];
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
