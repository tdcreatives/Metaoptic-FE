<?php
declare(strict_types=1);

namespace App\Libraries\Sgx;

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
        $this->announcements = new AnnouncementModel();
        $this->syncRuns = new SyncRunModel();
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
        foreach ($normalized as $row) {
            $existing = $this->announcements->where('sgx_reference', $row['sgx_reference'])->first();
            if ($existing === null) {
                $row['state'] = $this->config->backfill ? 'published' : 'pending_review';
                $row['published_at'] = $this->config->backfill ? $now : null;
                $row['needs_review'] = 0;
                $this->announcements->insert($row);
                $newCount++;
                continue;
            }
            if (($existing['source_hash'] ?? '') === $row['source_hash']) {
                continue;
            }
            $this->announcements->update($existing['id'], [
                'slug' => $row['slug'],
                'source_url' => $row['source_url'],
                'title' => $row['title'],
                'category' => $row['category'],
                'issuer' => $row['issuer'],
                'filed_at' => $row['filed_at'],
                'source_payload' => $row['source_payload'],
                'source_hash' => $row['source_hash'],
                'needs_review' => 1,
            ]);
            $updatedCount++;
        }
        $this->db->transComplete();
        if ($this->db->transStatus() === false) {
            throw new \RuntimeException('Sync transaction failed');
        }

        return [$newCount, $updatedCount];
    }
}
