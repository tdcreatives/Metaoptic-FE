<?php
declare(strict_types=1);

namespace Tests\Unit\Sgx;

use CodeIgniter\Test\CIUnitTestCase;
use Config\Sgx;

final class SgxConfigAutoPublishTest extends CIUnitTestCase
{
    public function test_auto_publish_defaults_false(): void
    {
        putenv('sgx.autoPublish');
        unset($_ENV['sgx.autoPublish'], $_SERVER['sgx.autoPublish']);
        $cfg = new Sgx();
        $this->assertFalse($cfg->autoPublish);
    }

    public function test_auto_publish_env_true(): void
    {
        putenv('sgx.autoPublish=true');
        $_ENV['sgx.autoPublish'] = 'true';
        $cfg = new Sgx();
        $this->assertTrue($cfg->autoPublish);
        putenv('sgx.autoPublish');
        unset($_ENV['sgx.autoPublish'], $_SERVER['sgx.autoPublish']);
    }
}
