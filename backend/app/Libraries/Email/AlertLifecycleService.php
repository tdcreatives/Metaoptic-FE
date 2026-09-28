<?php
declare(strict_types=1);

namespace App\Libraries\Email;

use App\Models\AnnouncementModel;
use App\Models\EmailAlertAnnouncementModel;
use App\Models\EmailAlertModel;
use DateTimeImmutable;
use DateTimeZone;
use DomainException;

final class AlertLifecycleService
{
    private const TZ = 'Asia/Singapore';

    public function __construct(
        private readonly EmailAlertModel $alerts = new EmailAlertModel(),
        private readonly EmailAlertAnnouncementModel $attaches = new EmailAlertAnnouncementModel(),
        private readonly AnnouncementModel $announcements = new AnnouncementModel(),
        private readonly AlertDispatchService $dispatch = new AlertDispatchService(),
    ) {
    }

    /** @param array<string, mixed> $data @param list<int> $announcementIds */
    public function saveDraft(array $data, array $announcementIds): int
    {
        $ids = $this->normalizeIds($announcementIds);
        $this->assertPublished($ids);

        $id = (int) $this->alerts->insert([
            'name' => $data['name'] ?? null,
            'subject' => (string) ($data['subject'] ?? ''),
            'intro' => $data['intro'] ?? null,
            'body_html' => (string) ($data['body_html'] ?? ''),
            'status' => 'draft',
        ], true);
        $this->replaceAttaches($id, $ids);

        return $id;
    }

    /** @param array<string, mixed> $data @param list<int> $announcementIds */
    public function updateDraft(int $id, array $data, array $announcementIds): void
    {
        $alert = $this->requireAlert($id);
        if ($alert['status'] !== 'draft') {
            throw new DomainException('not_draft');
        }
        $ids = $this->normalizeIds($announcementIds);
        $this->assertPublished($ids);
        $this->alerts->update($id, [
            'name' => $data['name'] ?? $alert['name'],
            'subject' => array_key_exists('subject', $data) ? (string) $data['subject'] : $alert['subject'],
            'intro' => array_key_exists('intro', $data) ? $data['intro'] : $alert['intro'],
            'body_html' => array_key_exists('body_html', $data) ? (string) $data['body_html'] : $alert['body_html'],
        ]);
        $this->replaceAttaches($id, $ids);
    }

    public function schedule(int $id, string $scheduledAtSgt): void
    {
        $alert = $this->requireAlert($id);
        if (! in_array((string) $alert['status'], ['draft', 'scheduled'], true)) {
            throw new DomainException('not_draft_or_scheduled');
        }
        $this->assertReadyToSend($alert);
        $tz = new DateTimeZone(self::TZ);
        $now = new DateTimeImmutable('now', $tz);
        $at = DateTimeImmutable::createFromFormat('Y-m-d H:i:s', $scheduledAtSgt, $tz);
        if ($at === false) {
            $at = new DateTimeImmutable($scheduledAtSgt, $tz);
        }
        if ($at <= $now) {
            throw new DomainException('scheduled_at_not_future');
        }
        $this->alerts->update($id, [
            'status' => 'scheduled',
            'scheduled_at' => $at->format('Y-m-d H:i:s'),
        ]);
    }

    public function cancelSchedule(int $id): void
    {
        $alert = $this->requireAlert($id);
        if ($alert['status'] !== 'scheduled') {
            throw new DomainException('not_scheduled');
        }
        $this->alerts->update($id, [
            'status' => 'draft',
            'scheduled_at' => null,
        ]);
    }

    public function sendNow(int $id): int
    {
        $alert = $this->requireAlert($id);
        $this->assertReadyToSend($alert);

        return $this->dispatch->dispatch($id);
    }

    public function deleteDraft(int $id): void
    {
        $alert = $this->requireAlert($id);
        if ($alert['status'] !== 'draft') {
            throw new DomainException('not_draft');
        }
        $this->alerts->delete($id);
    }

    /** @return list<array<string, mixed>> */
    public function dueScheduled(?DateTimeImmutable $nowSgt = null): array
    {
        $now = $nowSgt ?? new DateTimeImmutable('now', new DateTimeZone(self::TZ));
        if ($now->getTimezone()->getName() !== self::TZ) {
            $now = $now->setTimezone(new DateTimeZone(self::TZ));
        }

        return $this->alerts
            ->where('status', 'scheduled')
            ->where('scheduled_at <=', $now->format('Y-m-d H:i:s'))
            ->orderBy('scheduled_at', 'ASC')
            ->orderBy('id', 'ASC')
            ->findAll();
    }

    /** @param array<string, mixed> $alert */
    private function assertReadyToSend(array $alert): void
    {
        if (trim((string) $alert['subject']) === '') {
            throw new DomainException('empty_subject');
        }
        $ids = [];
        foreach ($this->attaches->where('email_alert_id', (int) $alert['id'])->findAll() as $row) {
            if ($row['announcement_id'] !== null) {
                $ids[] = (int) $row['announcement_id'];
            }
        }
        if ($ids === []) {
            throw new DomainException('no_announcements');
        }
        $this->assertPublished($ids);
    }

    /** @param list<int> $ids */
    private function assertPublished(array $ids): void
    {
        if ($ids === []) {
            return;
        }
        $rows = $this->announcements->whereIn('id', $ids)->findAll();
        $byId = [];
        foreach ($rows as $row) {
            $byId[(int) $row['id']] = $row;
        }
        foreach ($ids as $id) {
            if (! isset($byId[$id]) || ($byId[$id]['state'] ?? '') !== 'published') {
                throw new DomainException('not_published');
            }
        }
    }

    /** @param list<int> $ids */
    private function replaceAttaches(int $alertId, array $ids): void
    {
        $this->attaches->where('email_alert_id', $alertId)->delete();
        $sort = 0;
        foreach ($ids as $announcementId) {
            $this->attaches->insert([
                'email_alert_id' => $alertId,
                'announcement_id' => $announcementId,
                'sort_order' => $sort++,
            ]);
        }
    }

    /** @param list<int|string> $ids @return list<int> */
    private function normalizeIds(array $ids): array
    {
        $out = [];
        foreach ($ids as $id) {
            $n = (int) $id;
            if ($n > 0 && ! in_array($n, $out, true)) {
                $out[] = $n;
            }
        }

        return $out;
    }

    /** @return array<string, mixed> */
    private function requireAlert(int $id): array
    {
        $alert = $this->alerts->find($id);
        if (! is_array($alert)) {
            throw new DomainException('not_found');
        }

        return $alert;
    }
}
