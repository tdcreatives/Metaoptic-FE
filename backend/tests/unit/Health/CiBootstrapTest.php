<?php
declare(strict_types=1);

namespace Tests\Unit\Health;

use CodeIgniter\Test\CIUnitTestCase;

final class CiBootstrapTest extends CIUnitTestCase
{
    public function test_spark_file_exists(): void
    {
        $this->assertFileExists(ROOTPATH . 'spark');
    }
}
