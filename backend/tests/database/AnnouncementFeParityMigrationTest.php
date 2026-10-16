<?php
declare(strict_types=1);

namespace Tests\Database;

use CodeIgniter\Test\CIUnitTestCase;
use CodeIgniter\Test\DatabaseTestTrait;

final class AnnouncementFeParityMigrationTest extends CIUnitTestCase
{
    use DatabaseTestTrait;

    protected $migrate = true;
    protected $refresh = true;
    protected $namespace = 'App';

    public function test_fe_parity_columns_and_child_tables_exist(): void
    {
        $db = db_connect();
        foreach (['title_btn', 'ann_reference', 'addl_description', 'issuer_name'] as $col) {
            $this->assertTrue($db->fieldExists($col, 'announcements'), $col);
        }
        $this->assertTrue($db->tableExists('announcement_attachments'));
        $this->assertTrue($db->tableExists('announcement_related'));
        $this->assertTrue($db->tableExists('announcement_labeled_rows'));

        $db->table('announcements')->insert([
            'sgx_reference' => 'SG260911OTHR4TNS',
            'slug' => 'general-announcement-press-release-mot-announces-s1-1m-placement-for-full-automation-of-metalens-camera-modules-assembly',
            'source_url' => '',
            'title' => 'Press Release',
            'category' => 'General Announcement',
            'issuer' => 'METAOPTICS LTD',
            'filed_at' => '2026-09-11 20:43:00',
            'source_payload' => '{}',
            'source_hash' => str_repeat('a', 64),
            'source' => 'sgx',
            'state' => 'published',
            'needs_review' => 0,
            'ann_reference' => 'SG260911OTHR4TNS',
            'title_banner' => 'GENERAL<br/>ANNOUNCEMENT',
        ]);
        $id = (int) $db->insertID();
        $db->table('announcement_attachments')->insert([
            'announcement_id' => $id,
            'name' => 'Press.pdf',
            'url' => 'https://links.sgx.com/x',
            'sort_order' => 0,
        ]);
        $row = $db->table('announcements')->where('id', $id)->get()->getRowArray();
        $this->assertSame('SG260911OTHR4TNS', $row['ann_reference']);
    }
}
