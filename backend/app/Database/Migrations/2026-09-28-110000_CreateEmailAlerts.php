<?php
declare(strict_types=1);

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateEmailAlerts extends Migration
{
    public function up(): void
    {
        $this->forge->addField([
            'id' => ['type' => 'BIGINT', 'unsigned' => true, 'auto_increment' => true],
            'name' => ['type' => 'VARCHAR', 'constraint' => 255, 'null' => true],
            'subject' => ['type' => 'VARCHAR', 'constraint' => 255],
            'intro' => ['type' => 'TEXT', 'null' => true],
            'body_html' => ['type' => 'MEDIUMTEXT', 'null' => false, 'default' => ''],
            'status' => [
                'type' => 'ENUM',
                'constraint' => ['draft', 'scheduled', 'sending', 'sent'],
                'default' => 'draft',
                'null' => false,
            ],
            'scheduled_at' => ['type' => 'DATETIME', 'null' => true],
            'sent_at' => ['type' => 'DATETIME', 'null' => true],
            'audience_categories_json' => ['type' => 'JSON', 'null' => true],
            'campaign_id' => ['type' => 'BIGINT', 'unsigned' => true, 'null' => true],
            'created_at' => ['type' => 'DATETIME', 'null' => true],
            'updated_at' => ['type' => 'DATETIME', 'null' => true],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->createTable('email_alerts', true);

        $this->forge->addField([
            'id' => ['type' => 'BIGINT', 'unsigned' => true, 'auto_increment' => true],
            'email_alert_id' => ['type' => 'BIGINT', 'unsigned' => true],
            'announcement_id' => ['type' => 'BIGINT', 'unsigned' => true],
            'sort_order' => ['type' => 'INT', 'default' => 0],
            'snap_title' => ['type' => 'VARCHAR', 'constraint' => 512, 'null' => true],
            'snap_category' => ['type' => 'VARCHAR', 'constraint' => 128, 'null' => true],
            'snap_filed_at' => ['type' => 'DATETIME', 'null' => true],
            'snap_url' => ['type' => 'VARCHAR', 'constraint' => 512, 'null' => true],
            'snap_sgx_reference' => ['type' => 'VARCHAR', 'constraint' => 64, 'null' => true],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->addUniqueKey(['email_alert_id', 'announcement_id']);
        $this->forge->addForeignKey('email_alert_id', 'email_alerts', 'id', 'CASCADE', 'CASCADE');
        $this->forge->addForeignKey('announcement_id', 'announcements', 'id', 'CASCADE', 'RESTRICT');
        $this->forge->createTable('email_alert_announcements', true);

        // Task 1 rebuilt announcements; SQLite may leave this FK pointing at temp_announcements.
        // MySQL 1553: drop the FK before the unique index that backs it.
        $this->dropForeignKeysOnColumn('email_campaigns', 'announcement_id');
        $this->dropUniqueIndexOnColumn('email_campaigns', 'announcement_id');

        $this->forge->modifyColumn('email_campaigns', [
            'announcement_id' => [
                'name' => 'announcement_id',
                'type' => 'BIGINT',
                'unsigned' => true,
                'null' => true,
            ],
        ]);

        $this->forge->addColumn('email_campaigns', [
            'email_alert_id' => [
                'type' => 'BIGINT',
                'unsigned' => true,
                'null' => true,
                'after' => 'announcement_id',
            ],
        ]);

        $this->forge->addUniqueKey('email_alert_id');
        $this->forge->addForeignKey('email_alert_id', 'email_alerts', 'id', 'CASCADE', 'RESTRICT');
        $this->forge->addForeignKey('announcement_id', 'announcements', 'id', 'CASCADE', 'RESTRICT');
        $this->forge->processIndexes('email_campaigns');

        // Each SQLite rebuild of email_campaigns retargets inbound FKs at temp_email_campaigns.
        $this->rebindForeignKey('email_deliveries', 'campaign_id', 'email_campaigns', 'id', 'CASCADE', 'CASCADE');
    }

    public function down(): void
    {
        $this->db->resetTransStatus();

        $this->forge->dropTable('email_alert_announcements', true);
        $this->dropForeignKeysOnColumn('email_campaigns', 'email_alert_id');
        $this->dropUniqueIndexOnColumn('email_campaigns', 'email_alert_id');
        if ($this->db->fieldExists('email_alert_id', 'email_campaigns')) {
            $this->forge->dropColumn('email_campaigns', 'email_alert_id');
        }
        $this->forge->dropTable('email_alerts', true);
    }

    private function dropUniqueIndexOnColumn(string $table, string $column): void
    {
        foreach ($this->db->getIndexData($table) as $name => $index) {
            if (strtolower((string) $index->type) !== 'unique') {
                continue;
            }
            $fields = array_map('strtolower', $index->fields);
            if ($fields === [strtolower($column)]) {
                $this->forge->dropKey($table, $name, false);

                return;
            }
        }
    }

    private function dropForeignKeysOnColumn(string $table, string $column): void
    {
        foreach ($this->db->getForeignKeyData($table) as $name => $fk) {
            $cols = array_map('strtolower', (array) $fk->column_name);
            if (in_array(strtolower($column), $cols, true)) {
                $this->forge->dropForeignKey($table, $name);
            }
        }
    }

    private function rebindForeignKey(
        string $table,
        string $column,
        string $refTable,
        string $refCol,
        string $onUpdate,
        string $onDelete,
    ): void {
        $this->dropForeignKeysOnColumn($table, $column);
        $this->forge->addForeignKey($column, $refTable, $refCol, $onUpdate, $onDelete);
        $this->forge->processIndexes($table);
    }
}
