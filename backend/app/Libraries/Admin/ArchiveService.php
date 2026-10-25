<?php
declare(strict_types=1);

namespace App\Libraries\Admin;

use App\Models\AnnouncementModel;
use DomainException;

final class ArchiveService
{
    /** @return bool true if state changed to archived */
    public function archive(int $announcementId): bool
    {
        $model = model(AnnouncementModel::class);
        $row = $model->find($announcementId);
        if ($row === null) {
            throw new DomainException('not_found');
        }
        if (($row['state'] ?? '') === 'archived') {
            return false;
        }

        // Keep live_at if set — still on website until Publish to live site
        $model->update($announcementId, ['state' => 'archived']);

        return true;
    }
}
