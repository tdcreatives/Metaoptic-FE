<?php
declare(strict_types=1);

namespace Tests\Unit\Libraries\Http;

use App\Libraries\Http\CorsHeaders;
use CodeIgniter\Config\Factories;
use CodeIgniter\Test\CIUnitTestCase;
use Config\Sgx;

final class CorsHeadersTest extends CIUnitTestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        $cfg = new Sgx();
        $cfg->corsOrigins = [
            'https://metaoptics.sg',
            'http://localhost:4444',
        ];
        $cfg->corsOriginPatterns = ['https://*.pages.dev'];
        Factories::injectMock('config', Sgx::class, $cfg);
        Factories::injectMock('config', 'Sgx', $cfg);
    }

    public function test_exact_origin_allowed(): void
    {
        $this->assertTrue(CorsHeaders::isAllowedOrigin('https://metaoptics.sg'));
        $this->assertTrue(CorsHeaders::isAllowedOrigin('http://localhost:4444'));
        $this->assertFalse(CorsHeaders::isAllowedOrigin('https://evil.example'));
    }

    public function test_pages_dev_pattern_allowed(): void
    {
        $this->assertTrue(CorsHeaders::isAllowedOrigin('https://metaoptic.pages.dev'));
        $this->assertTrue(CorsHeaders::isAllowedOrigin('https://abc123.metaoptic.pages.dev'));
        $this->assertFalse(CorsHeaders::isAllowedOrigin('https://evil.com'));
        $this->assertFalse(CorsHeaders::isAllowedOrigin('http://metaoptic.pages.dev'));
    }
}
