<?php
declare(strict_types=1);

namespace App\Libraries\Admin;

use App\Models\AnnouncementModel;
use DomainException;

final class ArchiveService
{
    public function __construct(private readonly ?FeDeployHook $deployHook = null)
    {
    }

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

        $model->update($announcementId, ['state' => 'archived']);
        ($this->deployHook ?? FeDeployHook::fromConfig())->trigger('archive');

        return true;
    }
}
