<?php
declare(strict_types=1);

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateEmailAlertTables extends Migration
{
    public function up(): void
    {
        $this->forge->addField([
            'id' => ['type' => 'BIGINT', 'unsigned' => true, 'auto_increment' => true],
            'email' => ['type' => 'VARCHAR', 'constraint' => 255],
            'first_name' => ['type' => 'VARCHAR', 'constraint' => 255, 'null' => true],
            'last_name' => ['type' => 'VARCHAR', 'constraint' => 255, 'null' => true],
            'status' => [
                'type' => 'ENUM',
                'constraint' => ['active', 'unsubscribed'],
                'default' => 'active',
            ],
            'consented_at' => ['type' => 'DATETIME'],
            'unsubscribed_at' => ['type' => 'DATETIME', 'null' => true],
            'unsubscribe_token_hash' => ['type' => 'CHAR', 'constraint' => 64, 'null' => true],
            'created_at' => ['type' => 'DATETIME', 'null' => true],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->addUniqueKey('email');
        $this->forge->addUniqueKey('unsubscribe_token_hash');
        $this->forge->createTable('subscribers', true);

        $this->forge->addField([
            'subscriber_id' => ['type' => 'BIGINT', 'unsigned' => true],
            'category_key' => ['type' => 'VARCHAR', 'constraint' => 128],
        ]);
        $this->forge->addKey(['subscriber_id', 'category_key'], true);
        $this->forge->addForeignKey('subscriber_id', 'subscribers', 'id', 'CASCADE', 'CASCADE');
        $this->forge->createTable('subscriber_categories', true);

        $this->forge->addField([
            'id' => ['type' => 'BIGINT', 'unsigned' => true, 'auto_increment' => true],
            'campaign_id' => ['type' => 'BIGINT', 'unsigned' => true],
            'subscriber_id' => ['type' => 'BIGINT', 'unsigned' => true],
            'status' => [
                'type' => 'ENUM',
                'constraint' => ['queued', 'sending', 'sent', 'failed_temp', 'failed_perm'],
                'default' => 'queued',
            ],
            'attempts' => ['type' => 'INT', 'default' => 0],
            'provider_message_id' => ['type' => 'VARCHAR', 'constraint' => 255, 'null' => true],
            'last_error' => ['type' => 'VARCHAR', 'constraint' => 1000, 'null' => true],
            'created_at' => ['type' => 'DATETIME', 'null' => true],
            'updated_at' => ['type' => 'DATETIME', 'null' => true],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->addUniqueKey(['campaign_id', 'subscriber_id']);
        $this->forge->addForeignKey('campaign_id', 'email_campaigns', 'id', 'CASCADE', 'CASCADE');
        $this->forge->addForeignKey('subscriber_id', 'subscribers', 'id', 'CASCADE', 'RESTRICT');
        $this->forge->createTable('email_deliveries', true);
    }

    public function down(): void
    {
        $this->forge->dropTable('email_deliveries', true);
        $this->forge->dropTable('subscriber_categories', true);
        $this->forge->dropTable('subscribers', true);
    }
}
