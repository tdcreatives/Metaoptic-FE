<?php
declare(strict_types=1);

namespace Tests\Database;

use CodeIgniter\Test\CIUnitTestCase;
use CodeIgniter\Test\DatabaseTestTrait;

final class CmsMigrationTest extends CIUnitTestCase
{
    use DatabaseTestTrait;

    protected $migrate = true;
    protected $refresh = true;
    protected $namespace = 'App';

    public function test_cms_tables_exist(): void
    {
        $this->assertTrue($this->db->tableExists('audit_log'));
        $this->assertTrue($this->db->tableExists('admin_recipients'));
        $this->assertTrue($this->db->tableExists('email_campaigns'));
    }
}
