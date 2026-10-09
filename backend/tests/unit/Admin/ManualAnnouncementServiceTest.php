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

    public function test_create_persists_fe_scalars_and_attachments(): void
    {
        $id = (new ManualAnnouncementService())->create([
            'title' => 'FE Create',
            'category' => 'General Announcement',
            'filed_at' => '2026-09-28 09:00:00',
            'issuer_name' => 'MetaOptics Ltd',
            'ann_title' => 'Detail Title',
            'ann_description' => 'Body copy',
            'attachment_name' => ['Report.pdf', ''],
            'attachment_url' => ['https://example.test/r.pdf', ''],
        ]);

        $row = model(AnnouncementModel::class)->find($id);
        $this->assertSame('MetaOptics Ltd', $row['issuer']);
        $this->assertSame('MetaOptics Ltd', $row['issuer_name']);
        $this->assertSame('Detail Title', $row['ann_title']);
        $this->assertSame('Body copy', $row['ann_description']);

        $atts = db_connect()->table('announcement_attachments')
            ->where('announcement_id', $id)
            ->get()
            ->getResultArray();
        $this->assertCount(1, $atts);
        $this->assertSame('Report.pdf', $atts[0]['name']);
        $this->assertSame('https://example.test/r.pdf', $atts[0]['url']);
    }

    public function test_update_replaces_attachments_and_keeps_related(): void
    {
        $svc = new ManualAnnouncementService();
        $id = $svc->create([
            'title' => 'Update Me',
            'category' => 'General Announcement',
            'filed_at' => '2026-09-28 09:00:00',
            'ann_title' => 'Old',
            'attachment_name' => ['Old.pdf'],
            'attachment_url' => ['https://example.test/old.pdf'],
        ]);
        db_connect()->table('announcement_related')->insert([
            'announcement_id' => $id,
            'name' => 'Keep Me',
            'text' => 'related',
            'url' => null,
            'sort_order' => 0,
        ]);

        $svc->update($id, [
            'title' => 'Update Me',
            'category' => 'General Announcement',
            'filed_at' => '2026-09-28 09:00:00',
            'ann_title' => 'New Title',
            'issuer_name' => 'Issuer X',
            'attachment_name' => ['New.pdf'],
            'attachment_url' => ['https://example.test/new.pdf'],
        ]);

        $row = model(AnnouncementModel::class)->find($id);
        $this->assertSame('New Title', $row['ann_title']);
        $this->assertSame('Issuer X', $row['issuer_name']);

        $atts = db_connect()->table('announcement_attachments')
            ->where('announcement_id', $id)
            ->get()
            ->getResultArray();
        $this->assertCount(1, $atts);
        $this->assertSame('New.pdf', $atts[0]['name']);

        $related = db_connect()->table('announcement_related')
            ->where('announcement_id', $id)
            ->get()
            ->getResultArray();
        $this->assertCount(1, $related);
        $this->assertSame('Keep Me', $related[0]['name']);
    }
}
