<?php
declare(strict_types=1);

namespace Tests\Unit\Admin;

use App\Libraries\Admin\SendEmailGate;
use App\Models\AnnouncementModel;
use App\Models\EmailCampaignModel;
use CodeIgniter\Test\CIUnitTestCase;
use CodeIgniter\Test\DatabaseTestTrait;
use DomainException;

final class SendEmailGateTest extends CIUnitTestCase
{
    use DatabaseTestTrait;

    protected $migrate = true;
    protected $refresh = true;
    protected $namespace = 'App';

    public function test_send_blocked_until_published(): void
    {
        $this->expectException(DomainException::class);
        $this->expectExceptionMessage('not_published');
        (new SendEmailGate(model(EmailCampaignModel::class)))
            ->assertCanSend(['id' => 1, 'state' => 'pending_review']);
    }

    public function test_queue_campaign_blocked_until_published(): void
    {
        $this->expectException(DomainException::class);
        $this->expectExceptionMessage('not_published');
        (new SendEmailGate(model(EmailCampaignModel::class)))
            ->queueCampaign(['id' => 1, 'state' => 'pending_review']);
    }

    public function test_second_campaign_blocked(): void
    {
        $row = $this->publishedRow();
        $gate = new SendEmailGate(model(EmailCampaignModel::class));
        $gate->queueCampaign($row);

        $this->expectException(DomainException::class);
        $this->expectExceptionMessage('campaign_exists');
        $gate->assertCanSend($row);
    }

    public function test_queue_campaign_uses_email_copy_with_fallbacks(): void
    {
        $withCopy = $this->publishedRow([
            'email_subject' => 'Custom subject',
            'email_intro' => '<p>Intro</p>',
        ]);
        $gate = new SendEmailGate(model(EmailCampaignModel::class));
        $id = $gate->queueCampaign($withCopy);

        $campaign = (new EmailCampaignModel())->find($id);
        $this->assertSame('queued', $campaign['status']);
        $this->assertSame('Custom subject', $campaign['subject']);
        $this->assertSame('<p>Intro</p>', $campaign['body_html']);
        $this->assertSame((int) $withCopy['id'], (int) $campaign['announcement_id']);

        $fallback = $this->publishedRow([
            'title' => 'Fallback title',
            'summary' => 'Fallback summary',
            'email_subject' => null,
            'email_intro' => null,
        ]);
        $fallbackId = $gate->queueCampaign($fallback);
        $fallbackCampaign = (new EmailCampaignModel())->find($fallbackId);
        $this->assertSame('Fallback title', $fallbackCampaign['subject']);
        $this->assertSame('Fallback summary', $fallbackCampaign['body_html']);
    }

    /** @param array<string, mixed> $overrides */
    private function publishedRow(array $overrides = []): array
    {
        $id = (new AnnouncementModel())->insert(array_merge([
            'sgx_reference' => 'SND' . bin2hex(random_bytes(4)),
            'slug' => 'snd-' . bin2hex(random_bytes(4)),
            'source_url' => 'https://example.test/a',
            'title' => 'Published MOU',
            'category' => 'General Announcement',
            'issuer' => 'MetaOptics Ltd',
            'filed_at' => '2025-09-15 09:30:00',
            'source_payload' => '{}',
            'source_hash' => str_repeat('d', 64),
            'summary' => 'Public summary',
            'email_subject' => null,
            'email_intro' => null,
            'state' => 'published',
            'published_at' => '2025-09-15 10:00:00',
            'needs_review' => 0,
        ], $overrides), true);

        $row = (new AnnouncementModel())->find((int) $id);
        $this->assertIsArray($row);

        return $row;
    }
}
