<?php
declare(strict_types=1);

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateAnnouncementsAndSyncRuns extends Migration
{
    public function up(): void
    {
        $this->forge->addField([
            'id' => ['type' => 'BIGINT', 'unsigned' => true, 'auto_increment' => true],
            'sgx_reference' => ['type' => 'VARCHAR', 'constraint' => 64],
            'slug' => ['type' => 'VARCHAR', 'constraint' => 191],
            'source_url' => ['type' => 'VARCHAR', 'constraint' => 512, 'default' => ''],
            'title' => ['type' => 'VARCHAR', 'constraint' => 512],
            'category' => ['type' => 'VARCHAR', 'constraint' => 128, 'default' => 'General Announcement'],
            'issuer' => ['type' => 'VARCHAR', 'constraint' => 255, 'default' => ''],
            'filed_at' => ['type' => 'DATETIME'],
            'source_payload' => ['type' => 'JSON'],
            'source_hash' => ['type' => 'CHAR', 'constraint' => 64],
            'summary' => ['type' => 'TEXT', 'null' => true],
            'email_subject' => ['type' => 'VARCHAR', 'constraint' => 255, 'null' => true],
            'email_intro' => ['type' => 'TEXT', 'null' => true],
            'state' => ['type' => 'ENUM', 'constraint' => ['pending_review', 'published', 'archived'], 'default' => 'pending_review'],
            'published_at' => ['type' => 'DATETIME', 'null' => true],
            'needs_review' => ['type' => 'TINYINT', 'constraint' => 1, 'default' => 0],
            'created_at' => ['type' => 'DATETIME', 'null' => true],
            'updated_at' => ['type' => 'DATETIME', 'null' => true],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->addUniqueKey('sgx_reference');
        $this->forge->addUniqueKey('slug');
        $this->forge->addKey(['state', 'filed_at']);
        $this->forge->createTable('announcements', true);

        $this->forge->addField([
            'id' => ['type' => 'BIGINT', 'unsigned' => true, 'auto_increment' => true],
            'started_at' => ['type' => 'DATETIME'],
            'finished_at' => ['type' => 'DATETIME', 'null' => true],
            'status' => ['type' => 'ENUM', 'constraint' => ['running', 'success', 'failed'], 'default' => 'running'],
            'fetched_count' => ['type' => 'INT', 'default' => 0],
            'new_count' => ['type' => 'INT', 'default' => 0],
            'updated_count' => ['type' => 'INT', 'default' => 0],
            'error_message' => ['type' => 'VARCHAR', 'constraint' => 1000, 'null' => true],
            'created_at' => ['type' => 'DATETIME', 'null' => true],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->createTable('sync_runs', true);
    }

    public function down(): void
    {
        $this->forge->dropTable('sync_runs', true);
        $this->forge->dropTable('announcements', true);
    }
}
