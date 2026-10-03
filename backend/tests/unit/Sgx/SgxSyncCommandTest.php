<?php
declare(strict_types=1);

namespace Tests\Unit\Sgx;

use App\Commands\SgxSync;
use CodeIgniter\Test\CIUnitTestCase;

final class SgxSyncCommandTest extends CIUnitTestCase
{
    public function test_command_is_registered(): void
    {
        $commands = service('commands')->getCommands();
        $this->assertArrayHasKey('sgx:sync', $commands);
    }

    public function test_command_name(): void
    {
        $this->assertSame('sgx:sync', (new SgxSync(service('logger'), service('commands')))->name);
    }
}
