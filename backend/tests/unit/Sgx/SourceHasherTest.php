<?php
declare(strict_types=1);

namespace Tests\Unit\Sgx;

use App\Libraries\Sgx\SourceHasher;
use CodeIgniter\Test\CIUnitTestCase;

final class SourceHasherTest extends CIUnitTestCase
{
    public function test_hash_is_stable_sha256(): void
    {
        $payload = '{"id":1,"title":"x"}';
        $h = (new SourceHasher())->hash($payload);
        $this->assertSame(hash('sha256', $payload), $h);
        $this->assertSame(64, strlen($h));
    }
}
