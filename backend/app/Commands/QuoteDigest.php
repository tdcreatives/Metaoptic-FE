<?php
declare(strict_types=1);

namespace App\Commands;

use App\Libraries\Quote\QuoteDigestService;
use CodeIgniter\CLI\BaseCommand;
use CodeIgniter\CLI\CLI;

class QuoteDigest extends BaseCommand
{
    protected $group = 'Quote';
    protected $name = 'quote:digest';
    protected $description = 'Send daily MOT 9MT quote digest to press-release subscribers';

    public function run(array $params): int
    {
        $out = (new QuoteDigestService())->run();
        CLI::write($out['status']);
        if ($out['message'] !== '') {
            CLI::write($out['message']);
        }

        return EXIT_SUCCESS;
    }
}
