<?php
declare(strict_types=1);

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AlterAnnouncementsForCrud extends Migration
{
    public function up(): void
    {
        $this->forge->addColumn('announcements', [
            'source' => [
                'type' => 'ENUM',
                'constraint' => ['sgx', 'manual'],
                'default' => 'sgx',
                'null' => false,
                'after' => 'id',
            ],
            'body_html' => [
                'type' => 'TEXT',
                'null' => true,
                'after' => 'summary',
            ],
        ]);

        // Keep UNIQUE; only make the column nullable (SQLite tests + MySQL).
        $this->forge->modifyColumn('announcements', [
            'sgx_reference' => [
                'name' => 'sgx_reference',
                'type' => 'VARCHAR',
                'constraint' => 64,
                'null' => true,
            ],
        ]);
    }

    public function down(): void
    {
        $this->forge->dropColumn('announcements', ['source', 'body_html']);
        $this->forge->modifyColumn('announcements', [
            'sgx_reference' => [
                'name' => 'sgx_reference',
                'type' => 'VARCHAR',
                'constraint' => 64,
                'null' => false,
            ],
        ]);
    }
}
