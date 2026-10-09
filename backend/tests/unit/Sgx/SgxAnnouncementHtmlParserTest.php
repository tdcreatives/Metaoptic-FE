<?php
declare(strict_types=1);

namespace Tests\Unit\Sgx;

use App\Libraries\Sgx\SgxAnnouncementHtmlParser;
use CodeIgniter\Test\CIUnitTestCase;

final class SgxAnnouncementHtmlParserTest extends CIUnitTestCase
{
    public function test_parse_disclosure_page_maps_scalars_attachments_and_additional(): void
    {
        $html = (string) file_get_contents(SUPPORTPATH . 'Fixtures/sgx/detail-disclosure.html');
        $parsed = SgxAnnouncementHtmlParser::parse(
            $html,
            'https://links.sgx.com/1.0.0/corporate-announcements/C4QY18LURFPWL4L5/hash'
        );

        $s = $parsed['scalars'];
        $this->assertSame('METAOPTICS LTD', $s['issuer_name']);
        $this->assertSame('METAOPTICS LTD - KYG93Y1D1074 - 9MT', $s['securities_name']);
        $this->assertSame('No', $s['stapled_security_name']);
        $this->assertSame(
            'Disclosure of Interest/ Changes in Interest of Director/ Chief Executive Officer',
            $s['ann_title']
        );
        $this->assertSame('Disclosure of Interest of Director - Jee Wee Jene', $s['ann_subtitle']);
        $this->assertSame('18-Sep-2026 21:03:30', $s['ann_datetime']);
        $this->assertSame('New', $s['ann_status']);
        $this->assertSame('SG25010100ABCDE', $s['ann_reference']);
        $this->assertSame('Thng Chong Kim', $s['ann_submitted_by']);
        $this->assertSame('Executive Chairman', $s['ann_designation']);
        $this->assertStringContainsString('Please refer to the attachment.', (string) $s['ann_description']);
        $this->assertStringContainsString('ZICO Capital', (string) $s['ann_description']);

        $this->assertCount(2, $parsed['attachments']);
        $this->assertSame('MOT - Form 1 - Jee Wee Jene.pdf', $parsed['attachments'][0]['name']);
        $this->assertSame(
            'https://links.sgx.com/1.0.0/corporate-announcements/C4QY18LURFPWL4L5/904570_MOT%20-%20Form%201%20-%20Jee%20Wee%20Jene.pdf',
            $parsed['attachments'][0]['url']
        );

        $this->assertNotEmpty($parsed['labeled_rows']);
        $this->assertSame('additional_row', $parsed['labeled_rows'][0]['section']);
        $this->assertSame('Person(s) giving notice', $parsed['labeled_rows'][0]['name']);
    }
}
