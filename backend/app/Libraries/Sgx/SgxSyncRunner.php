<?php
declare(strict_types=1);

namespace App\Libraries\Sgx;

use App\Libraries\Admin\AdminDigestNotifier;
use CodeIgniter\Database\BaseConnection;
use Config\Services;
use Throwable;

/**
 * Shared entry for CLI `sgx:sync` and admin “Sync data now”.
 */
final class SgxSyncRunner
{
    public function __construct(
        private readonly ?BaseConnection $db = null,
        private readonly mixed $client = null,
    ) {
    }

    /**
     * @return array{ok: bool, locked: bool, message: string, result: ?SyncResult}
     */
    public function run(): array
    {
        $db = $this->db ?? db_connect();
        $lock = new SyncLock($db);
        if (! $lock->acquire('sgx_sync')) {
            return [
                'ok' => false,
                'locked' => true,
                'message' => 'Another sync is running. Wait and try again.',
                'result' => null,
            ];
        }

        try {
            $client = $this->client ?? Services::sgxClient();
            $items = $client->fetchAllPages();
            $sgx = config('Sgx');
            $fetcher = $sgx->fetchDetailHtml
                ? static fn (string $url): string => $client->fetchHtml($url)
                : null;
            $result = (new SyncService($db, $sgx, $fetcher))->run($items);
            $message = sprintf(
                'Sync OK — fetched=%d new=%d updated=%d',
                $result->fetchedCount,
                $result->newCount,
                $result->updatedCount
            );
            if (! $sgx->backfill && $result->newCount > 0) {
                (new AdminDigestNotifier())->notifyNewItems($result->newCount, []);
            }

            return [
                'ok' => true,
                'locked' => false,
                'message' => $message,
                'result' => $result,
            ];
        } catch (Throwable $e) {
            return [
                'ok' => false,
                'locked' => false,
                'message' => 'SYNC_FAILED: ' . substr($e->getMessage(), 0, 500),
                'result' => null,
            ];
        } finally {
            $lock->release('sgx_sync');
        }
    }
}
