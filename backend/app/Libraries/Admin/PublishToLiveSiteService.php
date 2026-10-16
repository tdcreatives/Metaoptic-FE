<?php
declare(strict_types=1);

namespace App\Libraries\Admin;

use App\Models\AnnouncementModel;

/**
 * Rebuild Cloudflare Pages and mark published rows as live (clear live_at for the rest).
 */
final class PublishToLiveSiteService
{
    public function __construct(private readonly ?FeDeployHook $deployHook = null)
    {
    }

    /**
     * @return array{synced_published: int, cleared: int}
     */
    public function run(): array
    {
        $now = date('Y-m-d H:i:s');
        $model = model(AnnouncementModel::class);
        $db = db_connect();

        $db->table('announcements')
            ->where('state', 'published')
            ->update(['live_at' => $now]);
        $synced = $db->affectedRows();

        $db->table('announcements')
            ->where('state !=', 'published')
            ->where('live_at IS NOT NULL', null, false)
            ->update(['live_at' => null]);
        $cleared = $db->affectedRows();

        ($this->deployHook ?? FeDeployHook::fromConfig())->trigger('publish_to_live_site');

        return [
            'synced_published' => max(0, $synced),
            'cleared' => max(0, $cleared),
        ];
    }

    public static function pendingCount(): int
    {
        $db = db_connect();
        // MySQL rejects DATETIME compared to '' — only IS NULL
        $publishedPending = (int) $db->table('announcements')
            ->where('state', 'published')
            ->where('live_at IS NULL', null, false)
            ->countAllResults();

        $staleLive = (int) $db->table('announcements')
            ->where('state !=', 'published')
            ->where('live_at IS NOT NULL', null, false)
            ->countAllResults();

        return $publishedPending + $staleLive;
    }
}
