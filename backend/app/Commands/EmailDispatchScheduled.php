<?php
declare(strict_types=1);

namespace App\Commands;

use App\Libraries\Email\AlertDispatchService;
use App\Libraries\Email\AlertLifecycleService;
use CodeIgniter\CLI\BaseCommand;
use CodeIgniter\CLI\CLI;

class EmailDispatchScheduled extends BaseCommand
{
    protected $group = 'Email';
    protected $name = 'email:dispatch-scheduled';
    protected $description = 'Dispatch due scheduled email alerts';

    public function run(array $params): int
    {
        $life = new AlertLifecycleService();
        $dispatch = new AlertDispatchService();
        $n = 0;
        foreach ($life->dueScheduled() as $row) {
            try {
                $dispatch->dispatch((int) $row['id']);
                $n++;
            } catch (\Throwable $e) {
                log_message('error', 'scheduled alert ' . (int) $row['id'] . ' failed: ' . $e->getMessage());
            }
        }
        CLI::write("dispatched={$n}");

        return EXIT_SUCCESS;
    }
}
