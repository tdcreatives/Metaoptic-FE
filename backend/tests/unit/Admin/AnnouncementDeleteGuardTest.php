<?php
declare(strict_types=1);

namespace Tests\Unit\Admin;

use App\Libraries\Admin\AnnouncementDeleteGuard;
use CodeIgniter\Test\CIUnitTestCase;

final class AnnouncementDeleteGuardTest extends CIUnitTestCase
{
    public function test_assert_can_delete_allows_any_id_in_phase_a(): void
    {
        (new AnnouncementDeleteGuard())->assertCanDelete(1);
        $this->assertTrue(true);
    }
}
