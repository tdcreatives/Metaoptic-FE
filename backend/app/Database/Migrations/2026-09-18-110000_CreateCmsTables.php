<?php
declare(strict_types=1);

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateCmsTables extends Migration
{
    public function up(): void
    {
        $this->forge->addField([
            'id' => ['type' => 'BIGINT', 'unsigned' => true, 'auto_increment' => true],
            'action' => ['type' => 'VARCHAR', 'constraint' => 64],
            'entity_type' => ['type' => 'VARCHAR', 'constraint' => 64, 'null' => true],
            'entity_id' => ['type' => 'VARCHAR', 'constraint' => 64, 'null' => true],
            'metadata_json' => ['type' => 'JSON', 'null' => true],
            'created_at' => ['type' => 'DATETIME', 'null' => true],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->createTable('audit_log', true);

        $this->forge->addField([
            'id' => ['type' => 'BIGINT', 'unsigned' => true, 'auto_increment' => true],
            'email' => ['type' => 'VARCHAR', 'constraint' => 255],
            'active' => ['type' => 'TINYINT', 'constraint' => 1, 'default' => 1],
            'created_at' => ['type' => 'DATETIME', 'null' => true],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->addUniqueKey('email');
        $this->forge->createTable('admin_recipients', true);

        $this->forge->addField([
            'id' => ['type' => 'BIGINT', 'unsigned' => true, 'auto_increment' => true],
            'announcement_id' => ['type' => 'BIGINT', 'unsigned' => true],
            'subject' => ['type' => 'VARCHAR', 'constraint' => 255],
            'body_html' => ['type' => 'TEXT'],
            'status' => [
                'type' => 'ENUM',
                'constraint' => ['draft', 'queued', 'sending', 'sent', 'partial_failed'],
                'default' => 'draft',
            ],
            'recipient_count' => ['type' => 'INT', 'default' => 0],
            'created_at' => ['type' => 'DATETIME', 'null' => true],
            'sent_at' => ['type' => 'DATETIME', 'null' => true],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->addUniqueKey('announcement_id');
        $this->forge->addForeignKey('announcement_id', 'announcements', 'id', 'CASCADE', 'RESTRICT');
        $this->forge->createTable('email_campaigns', true);
    }

    public function down(): void
    {
        $this->forge->dropTable('email_campaigns', true);
        $this->forge->dropTable('admin_recipients', true);
        $this->forge->dropTable('audit_log', true);
    }
}
