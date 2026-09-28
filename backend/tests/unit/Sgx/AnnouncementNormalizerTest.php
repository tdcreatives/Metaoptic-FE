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
        )['data'][0];

        $n = (new AnnouncementNormalizer())->normalize($item);

        $this->assertSame('SG25010100ABCDE', $n['sgx_reference']);
        $this->assertSame('general-announcement-metaoptics-enters-mou-sg25010100abcde', $n['slug']);
        $this->assertSame('METAOPTICS ENTERS MOU', $n['title']);
        $this->assertSame('General Announcement', $n['category']);
        $this->assertMatchesRegularExpression('/^\d{4}-\d{2}-\d{2} /', $n['filed_at']);
        $this->assertJson($n['source_payload']);
        $this->assertSame('https://example.test/sgx/announcement/SG25010100ABCDE', $n['source_url']);
        $this->assertSame('MetaOptics Ltd', $n['issuer']);
        $this->assertSame('2025-09-15 09:30:00', $n['filed_at']);
    }

    public function test_parse_filed_at_strtotime_fallback_keeps_sgt_wall_clock(): void
    {
        $item = [
            'ref_id' => 'SG25010100ABCDE',
            'title' => 'General Announcement::METAOPTICS ENTERS MOU',
            'category_name' => 'General Announcement',
            'url' => 'https://example.test/a',
            'date' => '2025-09-15 09:30:00',
        ];

        $previous = date_default_timezone_get();
        date_default_timezone_set('UTC');
        try {
            $n = (new AnnouncementNormalizer())->normalize($item);
        } finally {
            date_default_timezone_set($previous);
        }

        $this->assertSame('2025-09-15 09:30:00', $n['filed_at']);
    }

    public function test_slugify_caps_length_at_191(): void
    {
        $item = json_decode(
            file_get_contents(SUPPORTPATH . 'Fixtures/sgx/list-page-1.json'),
            true,
            512,
            JSON_THROW_ON_ERROR
        )['data'][0];
        $item['title'] = 'General Announcement::' . str_repeat('LongTitlePart', 20);

        $n = (new AnnouncementNormalizer())->normalize($item);

        $this->assertLessThanOrEqual(191, strlen($n['slug']));
    }

    public function test_rejects_non_http_source_url(): void
    {
        $item = json_decode(
            file_get_contents(SUPPORTPATH . 'Fixtures/sgx/list-page-1.json'),
            true,
            512,
            JSON_THROW_ON_ERROR
        )['data'][0];
        $item['url'] = 'javascript:alert(1)';

        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessage('Invalid source_url scheme');
        (new AnnouncementNormalizer())->normalize($item);
    }

    public function test_flat_api_item_omits_detail_wipe_keys(): void
    {
        $item = json_decode(
            file_get_contents(SUPPORTPATH . 'Fixtures/sgx/list-page-1.json'),
            true,
            512,
            JSON_THROW_ON_ERROR
        )['data'][0];

        $n = (new AnnouncementNormalizer())->normalize($item);

        $this->assertArrayNotHasKey('_attachments', $n);
        $this->assertArrayNotHasKey('_related', $n);
        $this->assertArrayNotHasKey('_labeled_rows', $n);
        $this->assertArrayNotHasKey('ann_reference', $n);
        $this->assertArrayNotHasKey('issuer_name', $n);
    }

    public function test_nested_details_return_scalars_and_children(): void
    {
        $item = json_decode(
            file_get_contents(SUPPORTPATH . 'Fixtures/announcements/fe-parity-one.json'),
            true,
            512,
            JSON_THROW_ON_ERROR
        )[0];

        $n = (new AnnouncementNormalizer())->normalize($item);

        $this->assertSame('SG260911OTHR4TNS', $n['sgx_reference']);
        $this->assertSame('SG260911OTHR4TNS', $n['ann_reference']);
        $this->assertSame('METAOPTICS LTD', $n['issuer_name']);
        $this->assertArrayHasKey('_attachments', $n);
        $this->assertArrayHasKey('_related', $n);
        $this->assertArrayHasKey('_labeled_rows', $n);
        $this->assertCount(1, $n['_attachments']);
        $this->assertSame(
            'MetaOptics - Sep 2026 Placement Press Release.pdf',
            $n['_attachments'][0]['name']
        );
    }
}
