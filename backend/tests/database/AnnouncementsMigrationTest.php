<?php
declare(strict_types=1);

namespace Tests\Database;

use CodeIgniter\Test\CIUnitTestCase;
use CodeIgniter\Test\DatabaseTestTrait;

final class AnnouncementsMigrationTest extends CIUnitTestCase
{
    use DatabaseTestTrait;

    protected $migrate = true;
    protected $refresh = true;
    protected $namespace = 'App';

    public function test_announcements_table_has_sgx_reference(): void
    {
        $this->assertTrue($this->db->tableExists('announcements'));
        $fields = array_column($this->db->getFieldData('announcements'), 'name');
        $this->assertContains('sgx_reference', $fields);
        $this->assertContains('source_payload', $fields);
        $this->assertContains('needs_review', $fields);
        $this->assertTrue($this->db->tableExists('sync_runs'));
    }
}
