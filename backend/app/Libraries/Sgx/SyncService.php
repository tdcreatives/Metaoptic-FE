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
    private AnnouncementNormalizer $normalizer;
    private SourceHasher $hasher;
    private AnnouncementModel $announcements;
    private SyncRunModel $syncRuns;

    public function __construct(
        private readonly BaseConnection $db,
        private readonly Sgx $config,
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
                    continue;
                }
                // Hash change: update core only, keep slug, do not wipe FE children unless nested details arrived.
                $this->announcements->update($existing['id'], [
                    'source_url' => $core['source_url'],
                    'title' => $core['title'],
                    'category' => $core['category'],
                    'issuer' => $core['issuer'],
                    'filed_at' => $core['filed_at'],
                    'source_payload' => $core['source_payload'],
                    'source_hash' => $core['source_hash'],
                    'needs_review' => 1,
                ]);
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
