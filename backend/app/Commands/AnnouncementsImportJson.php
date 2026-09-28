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
    protected $usage = 'announcements:import-json [path]';
    protected $arguments = [
        'path' => 'Absolute path to a JSON array of announcement objects',
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

        try {
            $result = (new JsonAnnouncementImporter(db_connect()))->import((string) $path);
        } catch (\Throwable $e) {
            CLI::error($e->getMessage());

            return EXIT_ERROR;
        }

        CLI::write(sprintf('OK inserted=%d updated=%d', $result['inserted'], $result['updated']));

        return EXIT_SUCCESS;
    }
}
