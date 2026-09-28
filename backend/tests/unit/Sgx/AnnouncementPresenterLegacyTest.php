<?php
declare(strict_types=1);

namespace Tests\Unit\Sgx;

use App\Libraries\Sgx\AnnouncementPresenter;
use CodeIgniter\Test\CIUnitTestCase;

final class AnnouncementPresenterLegacyTest extends CIUnitTestCase
{
    public function test_presenter_builds_nested_details_and_uses_ann_reference_not_slug(): void
    {
        $out = AnnouncementPresenter::fromRow([
            'id' => 67,
            'slug' => 'general-announcement-press-release-mot-announces-s1-1m-placement-for-full-automation-of-metalens-camera-modules-assembly',
            'title' => 'GENERAL ANNOUNCEMENT::PRESS RELEASE-MOT…',
            'category' => 'General Announcement',
            'summary' => '',
            'filed_at' => '2026-09-11 20:43:00',
            'title_btn' => null,
            'title_btn_sm' => null,
            'title_banner' => null,
            'issuer_name' => 'METAOPTICS LTD',
            'securities_name' => 'METAOPTICS LTD - KYG93Y1D1074 - 9MT',
            'stapled_security_name' => 'No',
            'ann_title' => 'General Announcement',
            'ann_subtitle' => 'Press Release-MOT announces S$1.1m placement…',
            'ann_datetime' => '11-Sep-2026 20:43:41',
            'ann_status' => 'New',
            'ann_reference' => 'SG260911OTHR4TNS',
            'ann_submitted_by' => 'Thng Chong Kim',
            'ann_designation' => 'Executive Chairman',
            'ann_description' => 'Please refer to the attached.',
            '_attachments' => [
                ['name' => 'MetaOptics - Sep 2026 Placement Press Release.pdf', 'url' => 'https://links.sgx.com/FileOpen/x'],
            ],
            '_related' => [],
            '_labeled_rows' => [],
        ]);
        $this->assertSame('SG260911OTHR4TNS', $out['details']['announcement']['reference']);
        $this->assertNotSame($out['slug'], $out['details']['announcement']['reference']);
        $this->assertSame('GENERAL<br/>ANNOUNCEMENT', $out['title_banner']);
        $this->assertSame('METAOPTICS LTD', $out['details']['issuer']['name']);
        $this->assertCount(1, $out['details']['attachments']);
        $this->assertSame(
            ['id', 'title', 'title_btn', 'title_btn_sm', 'title_banner', 'slug', 'desc', 'date', 'details', 'category'],
            array_keys($out)
        );
        $this->assertSame('11 Sep 2026 8:43 PM', $out['date']);
        $this->assertSame($out['title'], $out['title_btn']);
        $this->assertArrayNotHasKey('additional', $out['details']);
        $this->assertArrayNotHasKey('related', $out['details']);
        $this->assertArrayNotHasKey('eventNarrative', $out['details']);
    }

    public function test_layout_overrides_win_and_labeled_rows_map(): void
    {
        $out = AnnouncementPresenter::fromRow([
            'id' => 1,
            'slug' => 'agm',
            'title' => 'REPL::ANNUAL GENERAL MEETING:: VOLUNTARY',
            'category' => 'AGM / EGM',
            'summary' => 'See notice',
            'filed_at' => '2026-03-26 21:22:00',
            'title_btn' => 'REPL::ANNUAL<br/>GENERAL MEETING',
            'title_btn_sm' => 'REPL::ANNUAL GENERAL MEETING',
            'title_banner' => 'ANNUAL GENERAL<br/>MEETING',
            'ann_reference' => 'SG260326MEET20U5',
            'ann_title' => 'Annual General Meeting',
            '_attachments' => [],
            '_related' => [
                ['name' => 'Related Announcements:', 'text' => '26/03/2026 07:31:47', 'url' => 'https://links.sgx.com/x'],
            ],
            '_labeled_rows' => [
                ['section' => 'event_narrative', 'name' => 'Narrative Type', 'text' => 'Narrative Text', 'sort_order' => 0],
                ['section' => 'event_date_left', 'name' => 'Meeting Date and Time:', 'text' => '10/04/2026 10:00:00', 'sort_order' => 0],
                ['section' => 'event_date_right', 'name' => 'Response Deadline Date:', 'text' => '08/04/2026 10:00:00', 'sort_order' => 0],
                ['section' => 'event_venue', 'name' => 'Meeting Venue', 'text' => 'Raffles Town Club', 'sort_order' => 0],
                ['section' => 'additional_left', 'name' => 'Capital Amount-Old:', 'text' => 'SGD 9', 'sort_order' => 0],
                ['section' => 'other_directorship', 'name' => 'Present', 'text' => "1. A\n2. B", 'sort_order' => 0],
            ],
            'addl_description' => 'Person(s) giving notice',
        ]);

        $this->assertSame('ANNUAL GENERAL<br/>MEETING', $out['title_banner']);
        $this->assertSame('REPL::ANNUAL<br/>GENERAL MEETING', $out['title_btn']);
        $this->assertSame('See notice', $out['desc']);
        $this->assertSame('Narrative Text', $out['details']['eventNarrative'][0]['text']);
        $this->assertSame('10/04/2026 10:00:00', $out['details']['eventDates']['left'][0]['text']);
        $this->assertSame('Raffles Town Club', $out['details']['eventVenues'][0]['text']);
        $this->assertSame('SGD 9', $out['details']['additional']['left'][0]['text']);
        $this->assertSame('Person(s) giving notice', $out['details']['additional']['description']);
        $this->assertSame(['1. A', '2. B'], $out['details']['additional']['otherDirectorships'][0]['details']);
        $this->assertCount(1, $out['details']['related']);
    }
}
