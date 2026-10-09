<?php
declare(strict_types=1);

namespace Tests\Database;

use CodeIgniter\Test\CIUnitTestCase;
use CodeIgniter\Test\DatabaseTestTrait;

final class EmailMigrationTest extends CIUnitTestCase
{
    use DatabaseTestTrait;

    protected $migrate = true;
    protected $refresh = true;
    protected $namespace = 'App';

    public function test_email_alert_tables_exist(): void
    {
        $this->assertTrue($this->db->tableExists('subscribers'));
        $this->assertTrue($this->db->tableExists('subscriber_categories'));
        $this->assertTrue($this->db->tableExists('email_deliveries'));

        $subscribers = array_column($this->db->getFieldData('subscribers'), 'name');
        foreach (['email', 'first_name', 'last_name', 'status', 'consented_at', 'unsubscribed_at', 'unsubscribe_token_hash'] as $col) {
            $this->assertContains($col, $subscribers);
        }

        $categories = array_column($this->db->getFieldData('subscriber_categories'), 'name');
        $this->assertContains('subscriber_id', $categories);
        $this->assertContains('category_key', $categories);

        $deliveries = array_column($this->db->getFieldData('email_deliveries'), 'name');
        foreach (['campaign_id', 'subscriber_id', 'status', 'attempts', 'provider_message_id', 'last_error'] as $col) {
            $this->assertContains($col, $deliveries);
        }
    }
}
