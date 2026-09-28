<?php
declare(strict_types=1);

namespace Tests\Unit\Admin;

use App\Libraries\Admin\ManualAnnouncementService;
use App\Models\AnnouncementModel;
use CodeIgniter\Test\CIUnitTestCase;
use CodeIgniter\Test\DatabaseTestTrait;
use InvalidArgumentException;

final class ManualAnnouncementServiceTest extends CIUnitTestCase
{
    use DatabaseTestTrait;

    protected $migrate = true;
    protected $refresh = true;
    protected $namespace = 'App';

    public function test_create_manual_pending_with_null_sgx_reference(): void
    {
        $id = (new ManualAnnouncementService())->create([
            'title' => 'Board Update',
            'category' => 'General Announcement',
            'filed_at' => '2026-09-28 09:00:00',
            'summary' => 'Short',
        ]);

        $row = model(AnnouncementModel::class)->find($id);
        $this->assertSame('manual', $row['source']);
        $this->assertNull($row['sgx_reference']);
        $this->assertSame('pending_review', $row['state']);
        $this->assertNotSame('', $row['slug']);
    }

    public function test_create_rejects_empty_title(): void
    {
        $this->expectException(InvalidArgumentException::class);
        (new ManualAnnouncementService())->create([
            'title' => '  ',
            'category' => 'General Announcement',
            'filed_at' => '2026-09-28 09:00:00',
        ]);
    }
}
