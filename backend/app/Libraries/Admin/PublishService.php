<?php
declare(strict_types=1);

namespace App\Libraries\Admin;

use App\Models\AnnouncementModel;
use DomainException;

final class PublishService
{
    public function __construct(private readonly ?FeDeployHook $deployHook = null)
    {
    }

    /** @return bool true if state changed to published */
    public function publish(int $announcementId): bool
    {
        $model = model(AnnouncementModel::class);
        $row = $model->find($announcementId);
        if ($row === null) {
            throw new DomainException('not_found');
        }
        // pending_review and archived → published; already published is a no-op
        if ($row['state'] === 'published') {
            return false;
        }
        $model->update($announcementId, [
            'state' => 'published',
            'published_at' => date('Y-m-d H:i:s'),
            'needs_review' => 0,
        ]);

        ($this->deployHook ?? FeDeployHook::fromConfig())->trigger('publish');

        return true;
    }
}
