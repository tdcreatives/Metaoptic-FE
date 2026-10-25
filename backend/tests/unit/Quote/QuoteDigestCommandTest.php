<?php
declare(strict_types=1);

namespace Tests\Unit\Quote;

use App\Commands\QuoteDigest;
use CodeIgniter\Test\CIUnitTestCase;

final class QuoteDigestCommandTest extends CIUnitTestCase
{
    public function test_command_is_registered(): void
    {
        $commands = service('commands')->getCommands();
        $this->assertArrayHasKey('quote:digest', $commands);
    }

    public function test_command_name_and_group(): void
    {
        $cmd = new QuoteDigest(service('logger'), service('commands'));
        $this->assertSame('quote:digest', $cmd->name);
        $this->assertSame('Quote', $cmd->group);
    }
}
