<?php
declare(strict_types=1);

namespace App\Libraries\Admin;

use App\Libraries\Email\AlertBodyDefaults;
use App\Libraries\Email\AlertLifecycleService;
use App\Models\AnnouncementModel;
use DomainException;

final class AlertDraftFromAnnouncementService
{
    public function __construct(
        private readonly AnnouncementModel $announcements = new AnnouncementModel(),
        private readonly AlertLifecycleService $lifecycle = new AlertLifecycleService(),
    ) {
    }

    public function createDraft(int $announcementId): int
    {
        $row = $this->announcements->find($announcementId);
        if (! is_array($row)) {
            throw new DomainException('not_found');
        }
        if (($row['state'] ?? '') !== 'published') {
            throw new DomainException('not_published');
        }
        $liveAt = $row['live_at'] ?? null;
        if ($liveAt === null || $liveAt === '') {
            throw new DomainException('not_live_on_website');
        }

        $summary = (string) ($row['summary'] ?? '');

        return $this->lifecycle->saveDraft([
            'name' => null,
            'subject' => (string) $row['title'],
            'intro' => $summary !== '' ? $summary : null,
            'body_html' => AlertBodyDefaults::sampleHtml(),
        ], [$announcementId]);
    }
}
