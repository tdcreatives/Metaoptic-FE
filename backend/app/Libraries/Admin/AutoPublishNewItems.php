<?php
declare(strict_types=1);

namespace App\Libraries\Admin;

use App\Models\AnnouncementModel;

final class AutoPublishNewItems
{
    public function __construct(
        private readonly FeDeployHook $deployHook,
        private readonly AdminDigestNotifier $notifier = new AdminDigestNotifier(),
    ) {}

    /**
     * @param list<int> $newIds
     * @return 'auto_published'|'auto_publish_failed'|null
     */
    public function run(array $newIds): ?string
    {
        if ($newIds === []) {
            return null;
        }

        $model = model(AnnouncementModel::class);
        $now = date('Y-m-d H:i:s');

        $model->whereIn('id', $newIds)->set([
            'state' => 'published',
            'published_at' => $now,
            'live_at' => $now,
            'needs_review' => 0,
        ])->update();

        $ok = $this->deployHook->attempt('sgx_auto_publish');
        $refs = $this->refsForIds($newIds);
        $count = count($newIds);

        if ($ok) {
            $this->notifier->notifyNewItems($count, $refs, 'auto_published');

            return 'auto_published';
        }

        $model->whereIn('id', $newIds)->set([
            'state' => 'pending_review',
            'published_at' => null,
            'live_at' => null,
            'needs_review' => 0,
        ])->update();

        $this->notifier->notifyNewItems($count, $refs, 'auto_publish_failed');

        return 'auto_publish_failed';
    }

    /** @param list<int> $ids @return list<string> */
    private function refsForIds(array $ids): array
    {
        $rows = model(AnnouncementModel::class)
            ->whereIn('id', $ids)
            ->orderBy('id', 'ASC')
            ->findAll();

        return array_values(array_map(static fn (array $row): string => (string) $row['sgx_reference'], $rows));
    }
}
