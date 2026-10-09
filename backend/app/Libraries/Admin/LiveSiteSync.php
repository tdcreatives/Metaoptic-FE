<?php
declare(strict_types=1);

namespace App\Libraries\Admin;

/**
 * Helpers for CMS Publish vs "Publish to live site" (Cloudflare rebuild).
 */
final class LiveSiteSync
{
    /** True when website HTML/API still need a live-site publish pass. */
    public static function needsSync(array $row): bool
    {
        $state = (string) ($row['state'] ?? '');
        $liveAt = $row['live_at'] ?? null;
        $hasLive = $liveAt !== null && $liveAt !== '';

        if ($state === 'published') {
            return ! $hasLive;
        }

        // Archived (or other) but still marked live → remove on next sync
        return $hasLive;
    }

    public static function isLiveOnWebsite(array $row): bool
    {
        return ($row['state'] ?? '') === 'published'
            && ($row['live_at'] ?? null) !== null
            && ($row['live_at'] ?? '') !== '';
    }
}
