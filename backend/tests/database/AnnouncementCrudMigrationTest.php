<?php
declare(strict_types=1);

namespace Tests\Database;

use CodeIgniter\Test\CIUnitTestCase;
use CodeIgniter\Test\DatabaseTestTrait;

final class AnnouncementCrudMigrationTest extends CIUnitTestCase
{
    use DatabaseTestTrait;

    protected $migrate = true;
    protected $refresh = true;
    protected $namespace = 'App';

    public function test_announcements_have_source_and_nullable_sgx_reference(): void
    {
        $db = db_connect();
        $this->assertTrue($db->fieldExists('source', 'announcements'));
        $this->assertTrue($db->fieldExists('body_html', 'announcements'));

        $db->table('announcements')->insert([
            'sgx_reference' => null,
            'slug' => 'manual-test-slug',
            'source_url' => '',
            'title' => 'Manual item',
            'category' => 'General Announcement',
            'issuer' => '',
            'filed_at' => '2026-09-28 10:00:00',
            'source_payload' => '{}',
            'source_hash' => str_repeat('b', 64),
            'source' => 'manual',
            'body_html' => '<p>Hi</p>',
            'state' => 'pending_review',
            'needs_review' => 0,
        ]);

        $row = $db->table('announcements')->where('slug', 'manual-test-slug')->get()->getRowArray();
        $this->assertSame('manual', $row['source']);
        $this->assertNull($row['sgx_reference']);
    }
}
