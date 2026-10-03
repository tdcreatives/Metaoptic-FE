<?php
declare(strict_types=1);

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class NullableAlertAnnouncementFk extends Migration
{
    public function up(): void
    {
        $this->dropForeignKeysOnColumn('email_alert_announcements', 'announcement_id');
        $this->forge->modifyColumn('email_alert_announcements', [
            'announcement_id' => [
                'name' => 'announcement_id',
                'type' => 'BIGINT',
                'unsigned' => true,
                'null' => true,
            ],
        ]);
        $this->forge->addForeignKey('announcement_id', 'announcements', 'id', 'CASCADE', 'RESTRICT');
        $this->forge->processIndexes('email_alert_announcements');
    }

    public function down(): void
    {
        $this->db->resetTransStatus();
        if ($this->db->table('email_alert_announcements')->where('announcement_id', null)->countAllResults() > 0) {
            return;
        }
        $this->dropForeignKeysOnColumn('email_alert_announcements', 'announcement_id');
        $this->forge->modifyColumn('email_alert_announcements', [
            'announcement_id' => [
                'name' => 'announcement_id',
                'type' => 'BIGINT',
                'unsigned' => true,
                'null' => false,
            ],
        ]);
        $this->forge->addForeignKey('announcement_id', 'announcements', 'id', 'CASCADE', 'RESTRICT');
        $this->forge->processIndexes('email_alert_announcements');
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
}
