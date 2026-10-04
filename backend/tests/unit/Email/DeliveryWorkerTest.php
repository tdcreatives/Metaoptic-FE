<?php
declare(strict_types=1);

namespace Tests\Unit\Email;

use App\Libraries\Email\DeliveryWorker;
use App\Libraries\Email\LogMailer;
use App\Libraries\Email\MailerInterface;
use App\Libraries\Email\MailMessage;
use App\Libraries\Email\TemporaryMailException;
use App\Libraries\Email\UnsubscribeToken;
use App\Models\AnnouncementModel;
use App\Models\EmailAlertModel;
use App\Models\EmailCampaignModel;
use App\Models\EmailDeliveryModel;
use App\Models\SubscriberModel;
use CodeIgniter\Test\CIUnitTestCase;
use CodeIgniter\Test\DatabaseTestTrait;
use Config\EmailAlerts;

final class DeliveryWorkerTest extends CIUnitTestCase
{
    use DatabaseTestTrait;

    protected $migrate = true;
    protected $refresh = true;
    protected $namespace = 'App';

    private const SECRET = 'unit-test-secret-min-32-chars-long!!';
    private const SITE = 'https://metaoptics.test';

    protected function setUp(): void
    {
        parent::setUp();
        $cfg = config(EmailAlerts::class);
        $cfg->unsubscribeSecret = self::SECRET;
        $cfg->publicSiteUrl = self::SITE;
    }

    public function test_unsub_mid_queue_marks_failed_perm_and_does_not_send(): void
    {
        $mailer = new RecordingMailer();
        $subId = $this->insertSubscriber('gone@example.com', 'active');
        $campaignId = $this->insertCampaign();
        $deliveryId = $this->insertDelivery($campaignId, $subId, 'queued');

        (new SubscriberModel())->update($subId, [
            'status' => 'unsubscribed',
            'unsubscribed_at' => '2026-09-24 00:00:00',
        ]);

        $n = $this->worker($mailer)->processBatch(100);

        $this->assertSame(1, $n);
        $this->assertSame([], $mailer->sent);
        $row = (new EmailDeliveryModel())->find($deliveryId);
        $this->assertSame('failed_perm', $row['status']);
        $this->assertSame('unsubscribed', $row['last_error']);
        $this->assertSame('partial_failed', (new EmailCampaignModel())->find($campaignId)['status']);
    }

    public function test_temp_failure_retries_then_caps_to_failed_perm(): void
    {
        $mailer = new RecordingMailer();
        $mailer->throw = new TemporaryMailException('smtp 421');
        $subId = $this->insertSubscriber('retry@example.com', 'active');
        $campaignId = $this->insertCampaign();
        $deliveryId = $this->insertDelivery($campaignId, $subId, 'queued');
        $worker = $this->worker($mailer);

        $this->assertSame(1, $worker->processBatch(100));
        $row = (new EmailDeliveryModel())->find($deliveryId);
        $this->assertSame('failed_temp', $row['status']);
        $this->assertSame(1, (int) $row['attempts']);

        (new EmailDeliveryModel())->update($deliveryId, ['status' => 'queued']);
        $this->assertSame(1, $worker->processBatch(100));
        $row = (new EmailDeliveryModel())->find($deliveryId);
        $this->assertSame('failed_temp', $row['status']);
        $this->assertSame(2, (int) $row['attempts']);

        (new EmailDeliveryModel())->update($deliveryId, ['status' => 'queued']);
        $this->assertSame(1, $worker->processBatch(100));
        $row = (new EmailDeliveryModel())->find($deliveryId);
        $this->assertSame('failed_perm', $row['status']);
        $this->assertSame(3, (int) $row['attempts']);
        $this->assertSame([], $mailer->sent);
        $this->assertSame('partial_failed', (new EmailCampaignModel())->find($campaignId)['status']);
    }

    public function test_already_sent_is_not_sent_again(): void
    {
        $mailer = new RecordingMailer();
        $subId = $this->insertSubscriber('once@example.com', 'active');
        $campaignId = $this->insertCampaign();
        $deliveryId = $this->insertDelivery($campaignId, $subId, 'queued');
        $worker = $this->worker($mailer);

        $this->assertSame(1, $worker->processBatch(100));
        $this->assertCount(1, $mailer->sent);
        $row = (new EmailDeliveryModel())->find($deliveryId);
        $this->assertSame('sent', $row['status']);
        $this->assertSame('prov-1', $row['provider_message_id']);
        $this->assertSame('sent', (new EmailCampaignModel())->find($campaignId)['status']);

        $token = (new UnsubscribeToken(self::SECRET))->forSubscriber($subId);
        $expectedUrl = self::SITE . '/investor-relations/resources/email-alerts?unsub=' . $token;
        $html = (string) $mailer->sent[0]->htmlBody;
        $text = $mailer->sent[0]->textBody;
        $this->assertNotNull($mailer->sent[0]->htmlBody);
        $this->assertStringContainsString('<p style=', $html);
        $this->assertStringContainsString('>Unsubscribe</a>', $html);
        $this->assertStringContainsString($expectedUrl, $html);
        $this->assertStringContainsString($expectedUrl, $text);
        $this->assertStringContainsString('Published MOU', $text);
        $this->assertStringContainsString('Intro copy', $text);
        $this->assertStringNotContainsString('<p>', $text);

        $this->assertSame(0, $worker->processBatch(100));
        $this->assertCount(1, $mailer->sent);
        $row = (new EmailDeliveryModel())->find($deliveryId);
        $this->assertSame('sent', $row['status']);
        $this->assertSame(1, (int) $row['attempts']);
    }

    public function test_alert_campaign_log_mailer_has_subject_and_href(): void
    {
        $logPath = WRITEPATH . 'logs/mail-alert-' . bin2hex(random_bytes(4)) . '.log';
        try {
            $subId = $this->insertSubscriber('alert@example.com', 'active');
            $alertId = (int) (new EmailAlertModel())->insert([
                'subject' => 'Q3 IR blast',
                'body_html' => '<p>x</p>',
                'status' => 'sent',
            ], true);
            $campaignId = (int) (new EmailCampaignModel())->insert([
                'announcement_id' => null,
                'email_alert_id' => $alertId,
                'subject' => 'Q3 IR blast',
                'body_html' => '<ul><li><a href="https://ex.test/1">Item One</a></li></ul>',
                'status' => 'queued',
                'recipient_count' => 1,
            ], true);
            $this->insertDelivery($campaignId, $subId, 'queued');

            $n = $this->worker(new LogMailer($logPath))->processBatch(100);
            $this->assertSame(1, $n);

            $line = trim((string) file_get_contents($logPath));
            $logged = json_decode($line, true);
            $this->assertIsArray($logged);
            $this->assertSame('Q3 IR blast', $logged['subject']);
            $this->assertNotNull($logged['htmlBody']);
            $this->assertStringContainsString('<table role="presentation"', (string) $logged['htmlBody']);
            $this->assertStringContainsString('href="https://ex.test/1"', (string) $logged['htmlBody']);
            $this->assertStringNotContainsString('<ul', (string) $logged['textBody']);
            $this->assertStringContainsString('Item One', (string) $logged['textBody']);
        } finally {
            if (is_file($logPath)) {
                unlink($logPath);
            }
        }
    }

    private function worker(MailerInterface $mailer): DeliveryWorker
    {
        return new DeliveryWorker(db_connect(), $mailer, new UnsubscribeToken(self::SECRET));
    }

    private function insertSubscriber(string $email, string $status): int
    {
        return (int) (new SubscriberModel())->insert([
            'email' => $email,
            'first_name' => 'A',
            'last_name' => 'B',
            'status' => $status,
            'consented_at' => '2026-01-01 00:00:00',
            'unsubscribed_at' => $status === 'unsubscribed' ? '2026-02-01 00:00:00' : null,
        ], true);
    }

    private function insertCampaign(): int
    {
        $announcementId = (int) (new AnnouncementModel())->insert([
            'sgx_reference' => 'DW' . bin2hex(random_bytes(4)),
            'slug' => 'dw-' . bin2hex(random_bytes(4)),
            'source_url' => 'https://example.test/a',
            'title' => 'Published MOU',
            'category' => 'General Announcement',
            'issuer' => 'MetaOptics Ltd',
            'filed_at' => '2025-09-15 09:30:00',
            'source_payload' => '{}',
            'source_hash' => str_repeat('e', 64),
            'summary' => 'Public summary',
            'email_subject' => null,
            'email_intro' => 'Intro copy',
            'state' => 'published',
            'published_at' => '2025-09-15 10:00:00',
            'needs_review' => 0,
        ], true);

        return (int) (new EmailCampaignModel())->insert([
            'announcement_id' => $announcementId,
            'subject' => 'Published MOU',
            'body_html' => 'Intro copy',
            'status' => 'queued',
            'recipient_count' => 1,
        ], true);
    }

    private function insertDelivery(int $campaignId, int $subscriberId, string $status): int
    {
        return (int) (new EmailDeliveryModel())->insert([
            'campaign_id' => $campaignId,
            'subscriber_id' => $subscriberId,
            'status' => $status,
            'attempts' => 0,
        ], true);
    }
}

final class RecordingMailer implements MailerInterface
{
    /** @var list<MailMessage> */
    public array $sent = [];

    public ?\Throwable $throw = null;

    public function send(MailMessage $message): string
    {
        if ($this->throw !== null) {
            throw $this->throw;
        }
        $this->sent[] = $message;

        return 'prov-1';
    }
}
