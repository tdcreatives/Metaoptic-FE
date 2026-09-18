<?php
declare(strict_types=1);

namespace App\Libraries\Sgx;

final class SourceHasher
{
    public function hash(string $json): string
    {
        return hash('sha256', $json);
    }
}
