<?php
declare(strict_types=1);

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateQuoteDigestRuns extends Migration
{
    public function up(): void
    {
        $this->forge->addField([
            'id' => ['type' => 'BIGINT', 'unsigned' => true, 'auto_increment' => true],
            'digest_date' => ['type' => 'DATE'],
            'status' => ['type' => 'VARCHAR', 'constraint' => 40],
            'attempt_count' => ['type' => 'INT', 'default' => 0],
            'recipient_count' => ['type' => 'INT', 'default' => 0],
            'sent_count' => ['type' => 'INT', 'default' => 0],
            'failed_count' => ['type' => 'INT', 'default' => 0],
            'last_price' => ['type' => 'DECIMAL', 'constraint' => '12,6', 'null' => true],
            'change_abs' => ['type' => 'DECIMAL', 'constraint' => '12,6', 'null' => true],
            'change_pct' => ['type' => 'DECIMAL', 'constraint' => '12,6', 'null' => true],
            'quote_json' => ['type' => 'TEXT', 'null' => true],
            'error_message' => ['type' => 'VARCHAR', 'constraint' => 1000, 'null' => true],
            'started_at' => ['type' => 'DATETIME'],
            'finished_at' => ['type' => 'DATETIME', 'null' => true],
            'created_at' => ['type' => 'DATETIME', 'null' => true],
            'updated_at' => ['type' => 'DATETIME', 'null' => true],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->addUniqueKey('digest_date');
        $this->forge->createTable('quote_digest_runs', true);
    }

    public function down(): void
    {
        $this->forge->dropTable('quote_digest_runs', true);
    }
}
