<?php
declare(strict_types=1);

namespace Tests\Unit\Email;

use App\Libraries\Email\AlertLifecycleService;
use App\Models\AnnouncementModel;
use App\Models\EmailAlertModel;
use App\Models\SubscriberCategoryModel;
use App\Models\SubscriberModel;
use CodeIgniter\Test\CIUnitTestCase;
use CodeIgniter\Test\DatabaseTestTrait;
use DateTimeImmutable;
use DateTimeZone;
use DomainException;

final class AlertLifecycleServiceTest extends CIUnitTestCase
{
    use DatabaseTestTrait;

    protected $migrate = true;
    protected $refresh = true;
    protected $namespace = 'App';

    public function test_schedule_future_sets_scheduled(): void
    {
        $annId = $this->insertAnnouncement('published');
        $id = (new AlertLifecycleService())->saveDraft([
            'subject' => 'IR update',
            'body_html' => '<p>hi</p>',
        ], [$annId]);

        $at = $this->sgtNow()->modify('+2 hours')->format('Y-m-d H:i:s');
        (new AlertLifecycleService())->schedule($id, $at);

        $row = (new EmailAlertModel())->find($id);
        $this->assertSame('scheduled', $row['status']);
        $this->assertSame($at, $row['scheduled_at']);
    }

    public function test_due_picks_only_past_scheduled(): void
    {
        $annId = $this->insertAnnouncement('published');
        $life = new AlertLifecycleService();
        $pastId = $life->saveDraft(['subject' => 'Past', 'body_html' => '<p>p</p>'], [$annId]);
        $futureId = $life->saveDraft(['subject' => 'Future', 'body_html' => '<p>f</p>'], [$annId]);

        $now = $this->sgtNow();
        $life->schedule($pastId, $now->modify('+1 hour')->format('Y-m-d H:i:s'));
        $life->schedule($futureId, $now->modify('+3 hours')->format('Y-m-d H:i:s'));

        $due = $life->dueScheduled($now->modify('+2 hours'));
        $ids = array_map('intval', array_column($due, 'id'));
        $this->assertSame([$pastId], $ids);
    }

    public function test_delete_draft_rejects_sent(): void
    {
        $annId = $this->insertAnnouncement('published');
        $id = (new AlertLifecycleService())->saveDraft([
            'subject' => 'IR update',
            'body_html' => '<p>hi</p>',
        ], [$annId]);
        (new EmailAlertModel())->update($id, ['status' => 'sent']);

        $this->expectException(DomainException::class);
        $this->expectExceptionMessage('not_draft');
        (new AlertLifecycleService())->deleteDraft($id);
    }

    public function test_send_now_dispatches(): void
    {
        $annId = $this->insertAnnouncement('published');
        $this->insertSubscriber('a@example.com', ['General Announcement']);
        $id = (new AlertLifecycleService())->saveDraft([
            'subject' => 'IR update',
            'body_html' => '<p>{{announcement}}</p>',
        ], [$annId]);

        $campaignId = (new AlertLifecycleService())->sendNow($id);

        $this->assertGreaterThan(0, $campaignId);
        $row = (new EmailAlertModel())->find($id);
        $this->assertSame('sent', $row['status']);
        $this->assertSame($campaignId, (int) $row['campaign_id']);
    }

    public function test_schedule_invalid_datetime_throws(): void
    {
        $annId = $this->insertAnnouncement('published');
        $id = (new AlertLifecycleService())->saveDraft([
            'subject' => 'IR update',
            'body_html' => '<p>hi</p>',
        ], [$annId]);

        $this->expectException(DomainException::class);
        $this->expectExceptionMessage('invalid_scheduled_at');
        (new AlertLifecycleService())->schedule($id, 'not-a-datetime');
    }

    public function test_cancel_schedule_returns_to_draft(): void
    {
        $annId = $this->insertAnnouncement('published');
        $life = new AlertLifecycleService();
        $id = $life->saveDraft(['subject' => 'IR update', 'body_html' => '<p>hi</p>'], [$annId]);
        $life->schedule($id, $this->sgtNow()->modify('+1 day')->format('Y-m-d H:i:s'));
        $life->cancelSchedule($id);

        $row = (new EmailAlertModel())->find($id);
        $this->assertSame('draft', $row['status']);
        $this->assertNull($row['scheduled_at']);
    }

    private function sgtNow(): DateTimeImmutable
    {
        return new DateTimeImmutable('now', new DateTimeZone('Asia/Singapore'));
    }

    private function insertAnnouncement(string $state): int
    {
        return (int) (new AnnouncementModel())->insert([
            'sgx_reference' => 'DSP' . bin2hex(random_bytes(4)),
            'slug' => 'dsp-' . bin2hex(random_bytes(4)),
            'source_url' => 'https://example.test/' . bin2hex(random_bytes(2)),
            'title' => 'Item',
            'category' => 'General Announcement',
            'issuer' => 'MetaOptics Ltd',
            'filed_at' => '2026-09-28 09:00:00',
            'source_payload' => '{}',
            'source_hash' => hash('sha256', microtime()),
            'source' => 'manual',
            'summary' => 'Summary',
            'state' => $state,
            'published_at' => $state === 'published' ? '2026-09-28 10:00:00' : null,
            'live_at' => $state === 'published' ? '2026-09-28 10:00:00' : null,
            'needs_review' => 0,
        ], true);
    }

    /** @param list<string> $categories */
    private function insertSubscriber(string $email, array $categories): int
    {
        $id = (int) (new SubscriberModel())->insert([
            'email' => $email,
            'first_name' => 'A',
            'last_name' => 'B',
            'status' => 'active',
            'consented_at' => '2026-01-01 00:00:00',
        ], true);
        foreach ($categories as $key) {
            (new SubscriberCategoryModel())->insert([
                'subscriber_id' => $id,
                'category_key' => $key,
            ]);
        }

        return $id;
    }
}
