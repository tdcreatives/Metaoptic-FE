<?php
declare(strict_types=1);

namespace Tests\Unit\Admin;

use App\Libraries\Admin\AnnouncementWorkflowStatus;
use CodeIgniter\Test\CIUnitTestCase;

final class AnnouncementWorkflowStatusTest extends CIUnitTestCase
{
    public function test_pending_review_is_needs_review(): void
    {
        $this->assertSame(
            AnnouncementWorkflowStatus::NEEDS_REVIEW,
            AnnouncementWorkflowStatus::key(['state' => 'pending_review', 'needs_review' => 1]),
        );
    }

    public function test_published_without_live_is_ready(): void
    {
        $this->assertSame(
            AnnouncementWorkflowStatus::READY,
            AnnouncementWorkflowStatus::key([
                'state' => 'published',
                'needs_review' => 0,
                'live_at' => null,
            ]),
        );
    }

    public function test_published_needs_review_flag_is_ready(): void
    {
        $this->assertSame(
            AnnouncementWorkflowStatus::READY,
            AnnouncementWorkflowStatus::key([
                'state' => 'published',
                'needs_review' => 1,
                'live_at' => '2026-01-01 00:00:00',
            ]),
        );
    }

    public function test_live_on_site(): void
    {
        $this->assertSame(
            AnnouncementWorkflowStatus::LIVE,
            AnnouncementWorkflowStatus::key([
                'state' => 'published',
                'needs_review' => 0,
                'live_at' => '2026-01-01 00:00:00',
            ]),
        );
    }
}
