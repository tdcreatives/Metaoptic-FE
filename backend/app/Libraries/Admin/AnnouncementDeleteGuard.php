<?php
declare(strict_types=1);

namespace App\Libraries\Admin;

final class AnnouncementDeleteGuard
{
    public function assertCanDelete(int $announcementId): void
    {
        // Phase A: no email_alerts table usage yet.
    }
}
