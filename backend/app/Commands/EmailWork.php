<?php
declare(strict_types=1);

namespace App\Commands;

use App\Libraries\Email\DeliveryWorker;
use App\Libraries\Email\UnsubscribeToken;
use CodeIgniter\CLI\BaseCommand;
use CodeIgniter\CLI\CLI;
use Config\Services;

class EmailWork extends BaseCommand
{
    protected $group = 'Email';
    protected $name = 'email:work';
    protected $description = 'Send queued email alert deliveries';

    public function run(array $params): int
    {
        $n = (new DeliveryWorker(db_connect(), Services::mailer(), new UnsubscribeToken(config('EmailAlerts')->unsubscribeSecret)))
            ->processBatch(100);
        CLI::write("sent_or_processed={$n}");

        return EXIT_SUCCESS;
    }
}
