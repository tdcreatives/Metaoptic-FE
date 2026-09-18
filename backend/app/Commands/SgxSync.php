<?php
declare(strict_types=1);

namespace App\Commands;

use App\Libraries\Admin\AdminDigestNotifier;
use App\Libraries\Sgx\SyncLock;
use App\Libraries\Sgx\SyncService;
use CodeIgniter\CLI\BaseCommand;
use CodeIgniter\CLI\CLI;
use Config\Services;

class SgxSync extends BaseCommand
{
    protected $group = 'SGX';
    protected $name = 'sgx:sync';
    protected $description = 'Fetch and upsert MetaOptics SGX announcements';

    public function run(array $params): int
    {
        $db = db_connect();
        $lock = new SyncLock($db);
        if (!$lock->acquire('sgx_sync')) {
            CLI::error('Another sync is running');
            return EXIT_ERROR;
        }
        try {
            $client = Services::sgxClient();
            $items = $client->fetchAllPages();
            $result = (new SyncService($db, config('Sgx')))->run($items);
            CLI::write(sprintf(
                'OK fetched=%d new=%d updated=%d',
                $result->fetchedCount,
                $result->newCount,
                $result->updatedCount
            ));
            if (!config('Sgx')->backfill && $result->newCount > 0) {
                CLI::write('digest_pending new_count=' . $result->newCount);
                (new AdminDigestNotifier())->notifyNewItems($result->newCount, []);
            }
            return EXIT_SUCCESS;
        } catch (\Throwable $e) {
            CLI::error('SYNC_FAILED: ' . substr($e->getMessage(), 0, 500));
            return EXIT_ERROR;
        } finally {
            $lock->release('sgx_sync');
        }
    }
}
