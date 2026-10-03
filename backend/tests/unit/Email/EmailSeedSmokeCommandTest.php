<?php
declare(strict_types=1);

namespace Tests\Unit\Email;

use App\Commands\EmailSeedSmoke;
use CodeIgniter\Test\CIUnitTestCase;

final class EmailSeedSmokeCommandTest extends CIUnitTestCase
{
    public function test_command_is_registered(): void
    {
        $commands = service('commands')->getCommands();
        $this->assertArrayHasKey('email:seed-smoke', $commands);
    }

    public function test_refuses_when_ci_environment_is_not_staging(): void
    {
        $prev = getenv('CI_ENVIRONMENT');
        $prevEnv = $_ENV['CI_ENVIRONMENT'] ?? null;
        putenv('CI_ENVIRONMENT=testing');
        $_ENV['CI_ENVIRONMENT'] = 'testing';
        try {
            $cmd = new EmailSeedSmoke(service('logger'), service('commands'));
            $this->assertSame('email:seed-smoke', $cmd->name);
            $this->assertSame(EXIT_ERROR, $cmd->run([]));
        } finally {
            if ($prev === false) {
                putenv('CI_ENVIRONMENT');
            } else {
                putenv('CI_ENVIRONMENT=' . $prev);
            }
            if ($prevEnv === null) {
                unset($_ENV['CI_ENVIRONMENT']);
            } else {
                $_ENV['CI_ENVIRONMENT'] = $prevEnv;
            }
        }
    }
}
