<?php
declare(strict_types=1);

namespace Tests\Feature\Admin;

use App\Models\AnnouncementModel;
use App\Models\AuditLogModel;
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

    public function test_publish_sets_state_and_audits(): void
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
        $this->assertStringContainsString('not on the live website', (string) session('message'));

        $row = (new AnnouncementModel())->find($id);
        $this->assertNotNull($row);
        $this->assertSame('published', $row['state']);
        $this->assertSame(0, (int) $row['needs_review']);
        $this->assertNotEmpty($row['published_at']);
        $this->assertNull($row['live_at']);

        $publishAudit = (new AuditLogModel())->where('action', 'publish')->first();
        $this->assertNotNull($publishAudit);
        $this->assertSame('announcement', $publishAudit['entity_type']);
        $this->assertSame((string) $id, $publishAudit['entity_id']);
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
        $this->assertStringContainsString('Archived in CMS', (string) session('message'));

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
            'published_at' => '2026-09-28 10:00:00',
            'live_at' => '2026-09-28 10:00:00',
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

    public function test_cms_publish_hidden_from_api_until_live_sync(): void
    {
        $id = $this->insertRow([
            'sgx_reference' => 'PENDLIVE1',
            'slug' => 'pending-live-sync',
            'title' => 'CMS Only',
            'state' => 'pending_review',
            'needs_review' => 1,
        ]);
        $this->withSession(['admin' => true])->post(
            '/admin/announcements/' . $id . '/publish',
            $this->withCsrf([])
        );

        $api = $this->get('/api/announcements');
        $api->assertOK();
        $this->assertStringNotContainsString('pending-live-sync', $api->getBody());

        $this->withSession(['admin' => true])->post(
            '/admin/announcements/publish-to-live-site',
            $this->withCsrf([])
        );
        $this->assertNotEmpty((new AnnouncementModel())->find($id)['live_at']);

        $after = $this->get('/api/announcements');
        $after->assertOK();
        $this->assertStringContainsString('pending-live-sync', $after->getBody());
    }

    public function test_show_wires_csrf_publish_archive_and_delete_forms(): void
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
        $this->assertStringNotContainsString('admin/announcements/' . $id . '/send', $body);
        $this->assertStringContainsString('admin/announcements/' . $id . '/archive', $body);
        $this->assertStringContainsString('admin/announcements/' . $id . '/delete', $body);
        $this->assertSame(5, substr_count($body, csrf_token()));
        $this->assertMatchesRegularExpression('/<button[^>]*disabled[^>]*>\s*Published \(CMS\)/i', $body);
        $this->assertStringContainsString('publish-to-live-site', $this->withSession(['admin' => true])->get('/admin/announcements')->getBody());
    }

    public function test_publish_from_archived_restores_cms_published(): void
    {
        $id = $this->insertRow([
            'sgx_reference' => 'REPUB1',
            'slug' => 'republish-one',
            'title' => 'Restore Me',
            'state' => 'archived',
            'published_at' => '2025-01-01 00:00:00',
        ]);

        $result = $this->withSession(['admin' => true])->post(
            '/admin/announcements/' . $id . '/publish',
            $this->withCsrf([])
        );
        $result->assertRedirectTo('/admin/announcements/' . $id);

        $row = (new AnnouncementModel())->find($id);
        $this->assertSame('published', $row['state']);
        $this->assertNotSame('2025-01-01 00:00:00', $row['published_at']);
        $this->assertNull($row['live_at']);
    }

    public function test_list_state_toggle_publish_returns_to_list(): void
    {
        $id = $this->insertRow([
            'sgx_reference' => 'LISTPUB1',
            'slug' => 'list-publish',
            'title' => 'List Publish',
            'state' => 'pending_review',
        ]);

        $list = $this->withSession(['admin' => true])->get('/admin/announcements');
        $list->assertOK();
        $body = $list->getBody();
        $this->assertStringContainsString('badge-state-toggle', $body);
        $this->assertStringContainsString('return_to', $body);
        $this->assertStringContainsString('admin-confirm-dialog', $body);
        $this->assertStringContainsString('data-confirm-open', $body);
        $this->assertStringContainsString('admin-confirm-dialog.js', $body);
        $this->assertStringNotContainsString('onsubmit="return confirm(', $body);

        $result = $this->withSession(['admin' => true])->post(
            '/admin/announcements/' . $id . '/publish',
            $this->withCsrf(['return_to' => 'list'])
        );
        $result->assertRedirectTo('/admin/announcements');
        $this->assertStringContainsString('not on the live website', (string) session('message'));
        $this->assertSame('published', (new AnnouncementModel())->find($id)['state']);
    }

    public function test_list_state_toggle_archive_returns_to_list(): void
    {
        $id = $this->insertRow([
            'sgx_reference' => 'LISTARCH1',
            'slug' => 'list-archive',
            'title' => 'List Archive',
            'state' => 'published',
            'published_at' => '2026-09-28 10:00:00',
            'live_at' => '2026-09-28 10:00:00',
            'needs_review' => 0,
        ]);

        $result = $this->withSession(['admin' => true])->post(
            '/admin/announcements/' . $id . '/archive',
            $this->withCsrf(['return_to' => 'list'])
        );
        $result->assertRedirectTo('/admin/announcements');
        $this->assertStringContainsString('Publish to live site', (string) session('message'));
        $this->assertSame('archived', (new AnnouncementModel())->find($id)['state']);
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
        $row = array_merge([
            'source_url' => 'https://example.test/a',
            'title' => 'Item',
            'category' => 'General Announcement',
            'issuer' => 'MetaOptics Ltd',
            'filed_at' => '2025-09-15 09:30:00',
            'source_payload' => '{}',
            'source_hash' => str_repeat('f', 64),
            'summary' => 'Summary',
            'needs_review' => 1,
        ], $overrides);
        if (($row['state'] ?? '') === 'published' && ! array_key_exists('live_at', $row)) {
            $row['live_at'] = $row['published_at'] ?? '2025-09-15 10:00:00';
            $row['published_at'] = $row['published_at'] ?? $row['live_at'];
        }
        $model = new AnnouncementModel();
        $model->insert($row);

        return (int) $model->getInsertID();
    }
}
