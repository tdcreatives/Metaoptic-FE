<?php
declare(strict_types=1);

namespace App\Libraries\Sgx;

use App\Libraries\Admin\AnnouncementDetailWriter;
use App\Models\AnnouncementModel;
use App\Models\SyncRunModel;
use CodeIgniter\Database\BaseConnection;
use Config\Sgx;
use Throwable;

final class SyncService
{
    /** FE scalars from list API and/or HTML detail page. */
    private const FE_SCALAR_FIELDS = [
        'issuer_name',
        'securities_name',
        'stapled_security_name',
        'ann_title',
        'ann_subtitle',
        'ann_datetime',
        'ann_status',
        'ann_reference',
        'ann_submitted_by',
        'ann_designation',
        'ann_description',
        'ann_disclaimer',
        'ann_effective_start_date',
        'ann_report_type',
        'ann_final_year_end',
        'addl_description',
        'addl_name',
        'addl_age',
        'addl_date_cessation_known',
        'addl_date_of_appointment',
        'addl_date_cessation',
        'addl_country_of_principal_residence',
    ];

    private AnnouncementNormalizer $normalizer;
    private SourceHasher $hasher;
    private AnnouncementModel $announcements;
    private SyncRunModel $syncRuns;

    /**
     * @param (callable(string): string)|null $htmlFetcher GET announcement HTML by source_url
     */
    public function __construct(
        private readonly BaseConnection $db,
        private readonly Sgx $config,
        private readonly mixed $htmlFetcher = null,
    ) {
        $this->normalizer = new AnnouncementNormalizer();
        $this->hasher = new SourceHasher();
        $this->announcements = new AnnouncementModel($this->db);
        $this->syncRuns = new SyncRunModel($this->db);
    }

    /** @param list<mixed> $rawItems */
    public function run(array $rawItems): SyncResult
    {
        $fetchedCount = count($rawItems);
        $now = date('Y-m-d H:i:s');
        $runId = $this->syncRuns->insert([
            'started_at' => $now,
            'status' => 'running',
            'fetched_count' => $fetchedCount,
        ], true);

        try {
            $normalized = $this->normalizeAll($rawItems);
            [$newCount, $updatedCount] = $this->upsertAll($normalized, $now);

            $this->syncRuns->update($runId, [
                'finished_at' => date('Y-m-d H:i:s'),
                'status' => 'success',
                'fetched_count' => $fetchedCount,
                'new_count' => $newCount,
                'updated_count' => $updatedCount,
            ]);

            return new SyncResult($fetchedCount, $newCount, $updatedCount);
        } catch (Throwable $e) {
            $this->syncRuns->update($runId, [
                'finished_at' => date('Y-m-d H:i:s'),
                'status' => 'failed',
                'error_message' => substr($e->getMessage(), 0, 1000),
                'fetched_count' => $fetchedCount,
            ]);
            throw $e;
        }
    }

    /**
     * @param list<mixed> $rawItems
     * @return list<array<string, mixed>>
     */
    private function normalizeAll(array $rawItems): array
    {
        $normalized = [];
        foreach ($rawItems as $item) {
            if (! is_array($item)) {
                throw new \InvalidArgumentException('SGX item is not an object');
            }
            $row = $this->normalizer->normalize($item);
            $row['source_hash'] = $this->hasher->hash($row['source_payload']);
            $normalized[] = $row;
        }

        return $normalized;
    }

    /**
     * @param list<array<string, mixed>> $normalized
     * @return array{0: int, 1: int}
     */
    private function upsertAll(array $normalized, string $now): array
    {
        $newCount = 0;
        $updatedCount = 0;

        $this->db->transStart();
        try {
            foreach ($normalized as $row) {
                $existing = $this->announcements->where('sgx_reference', $row['sgx_reference'])->first();
                $needHtml = $existing === null
                    || ($existing['source_hash'] ?? '') !== ($row['source_hash'] ?? '')
                    || $this->missingRichDetail($existing);

                if ($needHtml) {
                    $row = $this->enrichFromHtml($row);
                }

                [$core, $details] = $this->splitDetails($row);
                if ($existing === null) {
                    $core['source'] = 'sgx';
                    $core['state'] = $this->config->backfill ? 'published' : 'pending_review';
                    $core['published_at'] = $this->config->backfill ? $now : null;
                    $core['needs_review'] = 0;
                    $id = (int) $this->announcements->insert($core, true);
                    if ($details !== null) {
                        $this->writeDetails($id, $core, $details);
                    }
                    $newCount++;
                    continue;
                }
                if (($existing['source_hash'] ?? '') === $core['source_hash']) {
                    // Same list payload: backfill FE fields / HTML detail left empty by older syncs.
                    if ($details !== null) {
                        $this->writeDetails((int) $existing['id'], $core, $details);
                    } else {
                        $fill = [];
                        foreach (self::FE_SCALAR_FIELDS as $field) {
                            if (
                                array_key_exists($field, $core)
                                && $core[$field] !== null
                                && ($existing[$field] ?? null) === null
                            ) {
                                $fill[$field] = $core[$field];
                            }
                        }
                        if ($fill !== []) {
                            $this->announcements->update($existing['id'], $fill);
                        }
                    }
                    continue;
                }
                // Hash change: update core + FE scalars; keep slug; replace children only when detail payload present.
                $update = [
                    'source_url' => $core['source_url'],
                    'title' => $core['title'],
                    'category' => $core['category'],
                    'issuer' => $core['issuer'],
                    'filed_at' => $core['filed_at'],
                    'source_payload' => $core['source_payload'],
                    'source_hash' => $core['source_hash'],
                    'needs_review' => 1,
                ];
                foreach (self::FE_SCALAR_FIELDS as $field) {
                    if (array_key_exists($field, $core) && $core[$field] !== null) {
                        $update[$field] = $core[$field];
                    }
                }
                $this->announcements->update($existing['id'], $update);
                if ($details !== null) {
                    $this->writeDetails((int) $existing['id'], $core, $details);
                }
                $updatedCount++;
            }
            $this->db->transComplete();
            if ($this->db->transStatus() === false) {
                throw new \RuntimeException('Sync transaction failed');
            }
        } catch (Throwable $e) {
            $this->db->transRollback();
            $this->db->resetTransStatus();
            throw $e;
        }

        return [$newCount, $updatedCount];
    }

    /** @param array<string, mixed>|null $row */
    private function missingRichDetail(?array $row): bool
    {
        if ($row === null) {
            return true;
        }
        if (($row['ann_description'] ?? null) === null || ($row['ann_description'] ?? '') === '') {
            return true;
        }
        $n = $this->db->table('announcement_attachments')
            ->where('announcement_id', (int) $row['id'])
            ->countAllResults();

        return $n === 0;
    }

    /**
     * Soft-fail: list fields stay if HTML fetch/parse fails.
     *
     * @param array<string, mixed> $row
     * @return array<string, mixed>
     */
    private function enrichFromHtml(array $row): array
    {
        if (! $this->config->fetchDetailHtml || ! is_callable($this->htmlFetcher)) {
            return $row;
        }
        // Nested JSON/fixture already carried children — do not re-fetch.
        if (array_key_exists('_attachments', $row)) {
            return $row;
        }
        $url = (string) ($row['source_url'] ?? '');
        if ($url === '' || ! str_contains(strtolower($url), 'links.sgx.com')) {
            return $row;
        }

        try {
            $html = ($this->htmlFetcher)($url);
            $parsed = SgxAnnouncementHtmlParser::parse($html, $url);
        } catch (Throwable) {
            return $row;
        }

        foreach ($parsed['scalars'] as $key => $value) {
            if ($value !== null && $value !== '') {
                $row[$key] = $value;
            }
        }
        $row['_attachments'] = $parsed['attachments'];
        $row['_related'] = $parsed['related'];
        $row['_labeled_rows'] = $parsed['labeled_rows'];

        return $row;
    }

    /**
     * @param array<string, mixed> $row
     * @return array{0: array<string, mixed>, 1: ?array{attachments: list<array<string, mixed>>, related: list<array<string, mixed>>, labeled: list<array<string, mixed>>}}
     */
    private function splitDetails(array $row): array
    {
        $hasDetails = array_key_exists('_attachments', $row);
        $details = $hasDetails ? [
            'attachments' => is_array($row['_attachments'] ?? null) ? $row['_attachments'] : [],
            'related' => is_array($row['_related'] ?? null) ? $row['_related'] : [],
            'labeled' => is_array($row['_labeled_rows'] ?? null) ? $row['_labeled_rows'] : [],
        ] : null;
        unset($row['_attachments'], $row['_related'], $row['_labeled_rows']);

        return [$row, $details];
    }

    /**
     * @param array<string, mixed> $core
     * @param array{attachments: list<array<string, mixed>>, related: list<array<string, mixed>>, labeled: list<array<string, mixed>>} $details
     */
    private function writeDetails(int $id, array $core, array $details): void
    {
        (new AnnouncementDetailWriter($this->db))->replace(
            $id,
            $core,
            $details['attachments'],
            $details['related'],
            $details['labeled'],
        );
    }
}
