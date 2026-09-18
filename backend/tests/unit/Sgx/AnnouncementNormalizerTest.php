<?php
declare(strict_types=1);

namespace Tests\Unit\Sgx;

use App\Libraries\Sgx\AnnouncementNormalizer;
use CodeIgniter\Test\CIUnitTestCase;

final class AnnouncementNormalizerTest extends CIUnitTestCase
{
    public function test_normalize_maps_reference_title_and_slug(): void
    {
        $item = json_decode(
            file_get_contents(SUPPORTPATH . 'Fixtures/sgx/list-page-1.json'),
            true,
            512,
            JSON_THROW_ON_ERROR
        )['items'][0];

        $n = (new AnnouncementNormalizer())->normalize($item);

        $this->assertSame('SG25010100ABCDE', $n['sgx_reference']);
        $this->assertSame('general-announcement-metaoptics-enters-mou-sg25010100abcde', $n['slug']);
        $this->assertNotSame('', $n['title']);
        $this->assertSame('General Announcement', $n['category']);
        $this->assertMatchesRegularExpression('/^\d{4}-\d{2}-\d{2} /', $n['filed_at']);
        $this->assertJson($n['source_payload']);
        $this->assertSame('https://example.test/sgx/announcement/SG25010100ABCDE', $n['source_url']);
        $this->assertSame('MetaOptics Ltd', $n['issuer']);
        $this->assertSame('2025-09-15 09:30:00', $n['filed_at']);
    }
}
