<?php
declare(strict_types=1);

namespace App\Commands;

use App\Libraries\Admin\JsonAnnouncementImporter;
use CodeIgniter\CLI\BaseCommand;
use CodeIgniter\CLI\CLI;

class AnnouncementsImportJson extends BaseCommand
{
    protected $group = 'Announcements';
    protected $name = 'announcements:import-json';
    protected $description = 'Import legacy announcements.json as published FE-parity rows';
    protected $usage = 'announcements:import-json [path] [--force]';
    protected $arguments = [
        'path' => 'Absolute path to a JSON array of announcement objects',
    ];
    protected $options = [
        '--force' => 'Overwrite state, needs_review, summary, and layout on existing slugs',
    ];

    public function run(array $params): int
    {
        $path = $params[0] ?? null;
        if ($path === null || $path === '') {
            $default = realpath(ROOTPATH . '../src/constants/announcements.json')
                ?: ROOTPATH . '../src/constants/announcements.json';
            if (! is_file($default)) {
                CLI::error('JSON path required; default not found: ' . $default);

                return EXIT_ERROR;
            }
            $path = $default;
        }

        $force = (bool) CLI::getOption('force');

        try {
            $result = (new JsonAnnouncementImporter(db_connect()))->import((string) $path, $force);
        } catch (\Throwable $e) {
            CLI::error($e->getMessage());

            return EXIT_ERROR;
        }

        CLI::write(sprintf('OK inserted=%d updated=%d', $result['inserted'], $result['updated']));
        foreach ($result['skipped_refs'] as $skip) {
            CLI::write(sprintf(
                'skipped sgx_reference slug=%s reference=%s',
                $skip['slug'],
                $skip['reference']
            ));
        }

        return EXIT_SUCCESS;
    }
}
