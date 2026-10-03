<?php
declare(strict_types=1);

namespace App\Commands;

use App\Libraries\Sgx\SgxSyncRunner;
use CodeIgniter\CLI\BaseCommand;
use CodeIgniter\CLI\CLI;

class SgxSync extends BaseCommand
{
    protected $group = 'SGX';
    protected $name = 'sgx:sync';
    protected $description = 'Fetch and upsert MetaOptics SGX announcements';

    public function run(array $params): int
    {
        $out = (new SgxSyncRunner())->run();
        if (! $out['ok']) {
            CLI::error($out['message']);

            return EXIT_ERROR;
        }

        CLI::write($out['message']);
        $result = $out['result'];
        if ($result !== null && $result->newCount > 0 && ! config('Sgx')->backfill) {
            CLI::write('digest_pending new_count=' . $result->newCount);
        }

        return EXIT_SUCCESS;
    }
}
