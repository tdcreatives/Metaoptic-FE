<?php
declare(strict_types=1);

namespace App\Libraries\Sgx;

final class SyncResult
{
    /** @param list<int> $newIds */
    public function __construct(
        public int $fetchedCount,
        public int $newCount,
        public int $updatedCount,
        public array $newIds = [],
    ) {}
}
