<?php
declare(strict_types=1);

namespace App\Libraries\Sgx;

use CodeIgniter\Database\BaseConnection;

final class SyncLock
{
    public function __construct(private readonly BaseConnection $db)
    {
    }

    public function acquire(string $name): bool
    {
        if ($this->db->DBDriver !== 'MySQLi') {
            // ponytail: SQLite tests have no GET_LOCK; prod uses MySQL advisory locks
            return true;
        }

        $row = $this->db->query('SELECT GET_LOCK(?, 0) AS acquired', [$name])->getRowArray();

        return isset($row['acquired']) && (int) $row['acquired'] === 1;
    }

    public function release(string $name): void
    {
        if ($this->db->DBDriver !== 'MySQLi') {
            return;
        }

        $this->db->query('SELECT RELEASE_LOCK(?)', [$name]);
    }
}
