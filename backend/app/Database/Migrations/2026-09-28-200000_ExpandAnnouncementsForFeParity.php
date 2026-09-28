<?php
declare(strict_types=1);

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class ExpandAnnouncementsForFeParity extends Migration
{
    /** @var list<string> */
    private array $announcementColumns = [
        'title_btn',
        'title_btn_sm',
        'title_banner',
        'issuer_name',
        'securities_name',
        'stapled_security_name',
        'ann_title',
        'ann_subtitle',
        'ann_datetime',
        'ann_status',
        'ann_reference',
        'ann_submitted_by',
        'ann_designation',
        'ann_description',
        'ann_disclaimer',
        'ann_effective_start_date',
        'ann_report_type',
        'ann_final_year_end',
        'addl_description',
        'addl_name',
        'addl_age',
        'addl_date_cessation_known',
        'addl_date_of_appointment',
        'addl_date_cessation',
        'addl_country_of_principal_residence',
    ];

    public function up(): void
    {
        $this->forge->addColumn('announcements', [
            'title_btn' => ['type' => 'TEXT', 'null' => true],
            'title_btn_sm' => ['type' => 'TEXT', 'null' => true],
            'title_banner' => ['type' => 'TEXT', 'null' => true],
            'issuer_name' => ['type' => 'VARCHAR', 'constraint' => 255, 'null' => true],
            'securities_name' => ['type' => 'VARCHAR', 'constraint' => 255, 'null' => true],
            'stapled_security_name' => ['type' => 'VARCHAR', 'constraint' => 255, 'null' => true],
            'ann_title' => ['type' => 'VARCHAR', 'constraint' => 255, 'null' => true],
            'ann_subtitle' => ['type' => 'VARCHAR', 'constraint' => 255, 'null' => true],
            'ann_datetime' => ['type' => 'VARCHAR', 'constraint' => 64, 'null' => true],
            'ann_status' => ['type' => 'VARCHAR', 'constraint' => 64, 'null' => true],
            'ann_reference' => ['type' => 'VARCHAR', 'constraint' => 64, 'null' => true],
            'ann_submitted_by' => ['type' => 'VARCHAR', 'constraint' => 255, 'null' => true],
            'ann_designation' => ['type' => 'VARCHAR', 'constraint' => 255, 'null' => true],
            'ann_description' => ['type' => 'TEXT', 'null' => true],
            'ann_disclaimer' => ['type' => 'TEXT', 'null' => true],
            'ann_effective_start_date' => ['type' => 'VARCHAR', 'constraint' => 64, 'null' => true],
            'ann_report_type' => ['type' => 'VARCHAR', 'constraint' => 64, 'null' => true],
            'ann_final_year_end' => ['type' => 'VARCHAR', 'constraint' => 64, 'null' => true],
            'addl_description' => ['type' => 'TEXT', 'null' => true],
            'addl_name' => ['type' => 'VARCHAR', 'constraint' => 255, 'null' => true],
            'addl_age' => ['type' => 'VARCHAR', 'constraint' => 255, 'null' => true],
            'addl_date_cessation_known' => ['type' => 'VARCHAR', 'constraint' => 255, 'null' => true],
            'addl_date_of_appointment' => ['type' => 'VARCHAR', 'constraint' => 255, 'null' => true],
            'addl_date_cessation' => ['type' => 'VARCHAR', 'constraint' => 255, 'null' => true],
            'addl_country_of_principal_residence' => ['type' => 'VARCHAR', 'constraint' => 255, 'null' => true],
        ]);

        $this->createChildTable('announcement_attachments', [
            'name' => ['type' => 'TEXT', 'null' => true],
            'url' => ['type' => 'VARCHAR', 'constraint' => 512, 'null' => true],
            'sort_order' => ['type' => 'INT', 'default' => 0],
        ]);
        $this->createChildTable('announcement_related', [
            'name' => ['type' => 'TEXT', 'null' => true],
            'text' => ['type' => 'TEXT', 'null' => true],
            'url' => ['type' => 'VARCHAR', 'constraint' => 512, 'null' => true],
            'sort_order' => ['type' => 'INT', 'default' => 0],
        ]);
        $this->createChildTable('announcement_labeled_rows', [
            'section' => ['type' => 'VARCHAR', 'constraint' => 64],
            'name' => ['type' => 'TEXT', 'null' => true],
            'text' => ['type' => 'TEXT', 'null' => true],
            'sort_order' => ['type' => 'INT', 'default' => 0],
        ]);
    }

    public function down(): void
    {
        $this->forge->dropTable('announcement_labeled_rows', true);
        $this->forge->dropTable('announcement_related', true);
        $this->forge->dropTable('announcement_attachments', true);

        foreach ($this->announcementColumns as $column) {
            if ($this->db->fieldExists($column, 'announcements')) {
                $this->forge->dropColumn('announcements', $column);
            }
        }
    }

    /**
     * @param array<string, array<string, mixed>> $extraFields
     */
    private function createChildTable(string $table, array $extraFields): void
    {
        $this->forge->addField([
            'id' => ['type' => 'BIGINT', 'unsigned' => true, 'auto_increment' => true],
            'announcement_id' => ['type' => 'BIGINT', 'unsigned' => true],
            ...$extraFields,
        ]);
        $this->forge->addKey('id', true);
        $this->forge->addKey('announcement_id');
        $this->forge->addForeignKey('announcement_id', 'announcements', 'id', 'CASCADE', 'CASCADE');
        $this->forge->createTable($table, true);
    }
}
