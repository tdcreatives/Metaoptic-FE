<?php
declare(strict_types=1);

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

/**
 * live_at = on the public MOT website after "Publish to live site" (CF rebuild).
 * CMS Publish alone sets published_at only.
 */
class AddAnnouncementLiveAt extends Migration
{
    public function up(): void
    {
        if (! $this->db->tableExists('announcements')) {
            return;
        }

        if (! $this->db->fieldExists('live_at', 'announcements')) {
            $this->forge->addColumn('announcements', [
                'live_at' => [
                    'type' => 'DATETIME',
                    'null' => true,
                ],
            ]);
        }

        // ponytail: existing published rows were already on the site before this gate
        if ($this->db->fieldExists('live_at', 'announcements')) {
            $this->db->query(
                "UPDATE announcements SET live_at = published_at"
                . " WHERE state = 'published' AND live_at IS NULL AND published_at IS NOT NULL"
            );
        }
    }

    public function down(): void
    {
        if ($this->db->tableExists('announcements') && $this->db->fieldExists('live_at', 'announcements')) {
            $this->forge->dropColumn('announcements', 'live_at');
        }
    }
}
