<?php
declare(strict_types=1);

namespace Tests\Feature\Admin;

use App\Models\AnnouncementModel;
use App\Models\AuditLogModel;
use App\Models\EmailCampaignModel;
use CodeIgniter\Test\CIUnitTestCase;
use CodeIgniter\Test\DatabaseTestTrait;
use CodeIgniter\Test\FeatureTestTrait;

final class AdminPublishSendTest extends CIUnitTestCase
{
    use DatabaseTestTrait;
    use FeatureTestTrait;

    protected $migrate = true;
    protected $refresh = true;
    protected $namespace = 'App';

    public function test_send_before_publish_is_rejected(): void
    {
        $id = $this->insertRow([
            'sgx_reference' => 'SEND1',
            'slug' => 'send-pending',
            'title' => 'Pending Send',
            'state' => 'pending_review',
        ]);

        $result = $this->withSession(['admin' => true])->post(
            '/admin/announcements/' . $id . '/send',
            $this->withCsrf([])
        );

        $result->assertRedirectTo('/admin/announcements/' . $id);
        $this->assertSame('not_published', session('error'));
        $this->assertSame(0, (new EmailCampaignModel())->where('announcement_id', $id)->countAllResults());
        $this->assertNull((new AuditLogModel())->where('action', 'send')->first());
    }

    public function test_publish_then_send_creates_one_campaign(): void
    {
        $id = $this->insertRow([
            'sgx_reference' => 'PUBSEND1',
            'slug' => 'publish-then-send',
            'title' => 'Publish Then Send',
            'email_subject' => 'Email subject',
            'email_intro' => 'Email intro',
            'state' => 'pending_review',
            'needs_review' => 1,
        ]);

        $publish = $this->withSession(['admin' => true])->post(
            '/admin/announcements/' . $id . '/publish',
            $this->withCsrf([])
        );
        $publish->assertRedirectTo('/admin/announcements/' . $id);

        $row = (new AnnouncementModel())->find($id);
        $this->assertNotNull($row);
        $this->assertSame('published', $row['state']);
        $this->assertSame(0, (int) $row['needs_review']);
        $this->assertNotEmpty($row['published_at']);

        $publishAudit = (new AuditLogModel())->where('action', 'publish')->first();
        $this->assertNotNull($publishAudit);
        $this->assertSame('announcement', $publishAudit['entity_type']);
        $this->assertSame((string) $id, $publishAudit['entity_id']);

        $send = $this->withSession(['admin' => true])->post(
            '/admin/announcements/' . $id . '/send',
            $this->withCsrf([])
        );
        $send->assertRedirectTo('/admin/announcements/' . $id);
        $this->assertSame('Email queued', session('message'));

        $campaigns = (new EmailCampaignModel())->where('announcement_id', $id)->findAll();
        $this->assertCount(1, $campaigns);
        $this->assertSame('queued', $campaigns[0]['status']);
        $this->assertSame('Email subject', $campaigns[0]['subject']);
        $this->assertSame('Email intro', $campaigns[0]['body_html']);

        $sendAudit = (new AuditLogModel())->where('action', 'send')->first();
        $this->assertNotNull($sendAudit);
        $this->assertSame((string) $id, $sendAudit['entity_id']);
        $this->assertStringContainsString((string) $campaigns[0]['id'], (string) $sendAudit['metadata_json']);
    }

    public function test_second_send_is_blocked(): void
    {
        $id = $this->insertRow([
            'sgx_reference' => 'PUBSEND2',
            'slug' => 'second-send-blocked',
            'title' => 'Second Send',
            'state' => 'published',
            'needs_review' => 0,
        ]);

        $first = $this->withSession(['admin' => true])->post(
            '/admin/announcements/' . $id . '/send',
            $this->withCsrf([])
        );
        $first->assertRedirectTo('/admin/announcements/' . $id);
        $this->assertSame(1, (new EmailCampaignModel())->where('announcement_id', $id)->countAllResults());

        $second = $this->withSession(['admin' => true])->post(
            '/admin/announcements/' . $id . '/send',
            $this->withCsrf([])
        );
        $second->assertRedirectTo('/admin/announcements/' . $id);
        $this->assertSame('campaign_exists', session('error'));
        $this->assertSame(1, (new EmailCampaignModel())->where('announcement_id', $id)->countAllResults());
    }

    public function test_retry_failed_requeues_when_deliveries_table_exists(): void
    {
        $this->assertTrue(db_connect()->tableExists('email_deliveries'));

        $result = $this->withSession(['admin' => true])->post(
            '/admin/campaigns/1/retry-failed',
            $this->withCsrf([])
        );

        $result->assertRedirect();
        $this->assertSame('Retries queued', session('message'));
    }

    public function test_archive_sets_state_and_audits(): void
    {
        $id = $this->insertRow([
            'sgx_reference' => 'ARCH1',
            'slug' => 'archive-one',
            'title' => 'Archive Me',
            'state' => 'published',
            'needs_review' => 0,
        ]);

        $result = $this->withSession(['admin' => true])->post(
            '/admin/announcements/' . $id . '/archive',
            $this->withCsrf([])
        );

        $result->assertRedirectTo('/admin/announcements/' . $id);
        $this->assertSame('Archived', session('message'));

        $row = (new AnnouncementModel())->find($id);
        $this->assertNotNull($row);
        $this->assertSame('archived', $row['state']);

        $audit = (new AuditLogModel())->where('action', 'archive')->first();
        $this->assertNotNull($audit);
        $this->assertSame('announcement', $audit['entity_type']);
        $this->assertSame((string) $id, $audit['entity_id']);
    }

    public function test_archive_drops_item_from_public_api(): void
    {
        $id = $this->insertRow([
            'sgx_reference' => 'ARCHAPI1',
            'slug' => 'archive-from-api',
            'title' => 'Public Then Archive',
            'state' => 'published',
            'needs_review' => 0,
        ]);

        $before = $this->get('/api/announcements');
        $before->assertOK();
        $this->assertStringContainsString('archive-from-api', $before->getBody());

        $this->withSession(['admin' => true])->post(
            '/admin/announcements/' . $id . '/archive',
            $this->withCsrf([])
        );

        $after = $this->get('/api/announcements');
        $after->assertOK();
        $this->assertStringNotContainsString('archive-from-api', $after->getBody());
    }

    public function test_show_wires_csrf_publish_and_send_forms(): void
    {
        $id = $this->insertRow([
            'sgx_reference' => 'FORMS1',
            'slug' => 'forms-one',
            'title' => 'Forms',
            'state' => 'published',
        ]);

        $show = $this->withSession(['admin' => true])->get('/admin/announcements/' . $id);
        $show->assertOK();
        $body = $show->getBody();
        $this->assertStringContainsString('admin/announcements/' . $id . '/publish', $body);
        $this->assertStringContainsString('admin/announcements/' . $id . '/send', $body);
        $this->assertStringContainsString('admin/announcements/' . $id . '/archive', $body);
        $this->assertSame(4, substr_count($body, csrf_token()));
        $this->assertStringContainsString('<button type="submit" disabled>Publish</button>', $body);
    }

    public function test_publish_without_csrf_does_not_mutate(): void
    {
        $id = $this->insertRow([
            'sgx_reference' => 'CSRF1',
            'slug' => 'csrf-publish',
            'title' => 'CSRF Publish',
            'state' => 'pending_review',
            'needs_review' => 1,
        ]);

        $this->expectException(\CodeIgniter\Security\Exceptions\SecurityException::class);
        try {
            $this->withSession(['admin' => true])->post(
                '/admin/announcements/' . $id . '/publish',
                []
            );
        } finally {
            $row = (new AnnouncementModel())->find($id);
            $this->assertSame('pending_review', $row['state']);
            $this->assertNull((new AuditLogModel())->where('action', 'publish')->first());
        }
    }

    /** @param array<string, string> $fields */
    private function withCsrf(array $fields): array
    {
        helper('security');
        $fields[csrf_token()] = csrf_hash();

        return $fields;
    }

    /** @param array<string, mixed> $overrides */
    private function insertRow(array $overrides): int
    {
        $model = new AnnouncementModel();
        $model->insert(array_merge([
            'source_url' => 'https://example.test/a',
            'title' => 'Item',
            'category' => 'General Announcement',
            'issuer' => 'MetaOptics Ltd',
            'filed_at' => '2025-09-15 09:30:00',
            'source_payload' => '{}',
            'source_hash' => str_repeat('f', 64),
            'summary' => 'Summary',
            'needs_review' => 1,
        ], $overrides));

        return (int) $model->getInsertID();
    }
}
