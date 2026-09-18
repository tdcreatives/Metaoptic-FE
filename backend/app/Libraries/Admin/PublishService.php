<?php
declare(strict_types=1);

namespace App\Libraries\Admin;

use App\Models\AnnouncementModel;
use DomainException;

final class PublishService
{
    public function publish(int $announcementId): void
    {
        $model = model(AnnouncementModel::class);
        $row = $model->find($announcementId);
        if ($row === null) {
            throw new DomainException('not_found');
        }
        if ($row['state'] === 'archived') {
            throw new DomainException('archived');
        }
        $model->update($announcementId, [
            'state' => 'published',
            'published_at' => date('Y-m-d H:i:s'),
            'needs_review' => 0,
        ]);
    }
}
