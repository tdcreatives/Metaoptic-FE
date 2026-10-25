<?php
declare(strict_types=1);

namespace App\Libraries\Admin;

use App\Models\EmailAlertAnnouncementModel;
use DomainException;

final class AnnouncementDeleteGuard
{
    public function __construct(
        private readonly EmailAlertAnnouncementModel $attaches = new EmailAlertAnnouncementModel(),
    ) {
    }

    public function prepareForDelete(int $announcementId): void
    {
        $db = db_connect();
        $links = $db->table('email_alert_announcements eaa')
            ->select('eaa.id, eaa.snap_title, eaa.snap_category, eaa.snap_filed_at, eaa.snap_url, eaa.snap_sgx_reference, ea.status, a.title, a.category, a.filed_at, a.source_url, a.sgx_reference')
            ->join('email_alerts ea', 'ea.id = eaa.email_alert_id')
            ->join('announcements a', 'a.id = eaa.announcement_id')
            ->where('eaa.announcement_id', $announcementId)
            ->get()
            ->getResultArray();

        foreach ($links as $link) {
            if (($link['status'] ?? '') === 'sending') {
                throw new DomainException('locked_sending');
            }
        }

        foreach ($links as $link) {
            $status = (string) ($link['status'] ?? '');
            $rowId = (int) $link['id'];
            if (in_array($status, ['draft', 'scheduled'], true)) {
                $this->attaches->delete($rowId);
                continue;
            }
            if ($status === 'sent') {
                $this->attaches->update($rowId, [
                    'announcement_id' => null,
                    'snap_title' => $this->filled($link['snap_title'] ?? null, $link['title'] ?? null),
                    'snap_category' => $this->filled($link['snap_category'] ?? null, $link['category'] ?? null),
                    'snap_filed_at' => $this->filled($link['snap_filed_at'] ?? null, $link['filed_at'] ?? null),
                    'snap_url' => $this->filled($link['snap_url'] ?? null, $link['source_url'] ?? null),
                    'snap_sgx_reference' => $this->filled($link['snap_sgx_reference'] ?? null, $link['sgx_reference'] ?? null),
                ]);
            }
        }
    }

    private function filled(mixed $snap, mixed $live): mixed
    {
        if ($snap !== null && $snap !== '') {
            return $snap;
        }

        return $live;
    }
}
