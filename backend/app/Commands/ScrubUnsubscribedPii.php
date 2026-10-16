<?php
declare(strict_types=1);

namespace App\Commands;

use CodeIgniter\CLI\BaseCommand;
use CodeIgniter\CLI\CLI;

class ScrubUnsubscribedPii extends BaseCommand
{
    protected $group = 'Email';
    protected $name = 'email:scrub-pii';
    protected $description = 'Null names on unsubscribed subscribers older than 30 days';

    public function run(array $params): int
    {
        $cutoff = date('Y-m-d H:i:s', strtotime('-30 days'));
        $builder = db_connect()->table('subscribers');
        $builder->where('status', 'unsubscribed')
            ->where('unsubscribed_at <', $cutoff)
            ->update([
                'first_name' => null,
                'last_name' => null,
            ]);
        CLI::write('scrubbed=' . $builder->db()->affectedRows());

        return EXIT_SUCCESS;
    }
}
