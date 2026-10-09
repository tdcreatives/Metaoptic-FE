<?php
declare(strict_types=1);

namespace App\Libraries\Sgx;

final class SyncResult
{
    public function __construct(
        public int $fetchedCount,
        public int $newCount,
        public int $updatedCount,
    ) {}
}
