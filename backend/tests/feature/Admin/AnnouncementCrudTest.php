<?php
declare(strict_types=1);

namespace Tests\Feature\Admin;

use App\Models\AnnouncementModel;
use CodeIgniter\Exceptions\PageNotFoundException;
use CodeIgniter\Test\CIUnitTestCase;
use CodeIgniter\Test\DatabaseTestTrait;
use CodeIgniter\Test\FeatureTestTrait;

final class AnnouncementCrudTest extends CIUnitTestCase
{
    use DatabaseTestTrait;
    use FeatureTestTrait;

    protected $migrate = true;
    protected $refresh = true;
    protected $namespace = 'App';

    public function test_create_manual_announcement_via_post(): void
    {
        $result = $this->withSession(['admin' => true])->post(
            '/admin/announcements',
            $this->withCsrf([
                'title' => 'Manual IR Note',
                'category' => 'General Announcement',
                'filed_at' => '2026-09-28 11:00:00',
                'summary' => 'Summary',
            ])
        );

        $result->assertRedirect();

        $row = (new AnnouncementModel())->where('title', 'Manual IR Note')->first();
        $this->assertNotNull($row);
        $this->assertSame('manual', $row['source']);
        $this->assertSame('pending_review', $row['state']);
        $result->assertRedirectTo('/admin/announcements/' . $row['id']);
    }

    public function test_create_ignores_posted_state(): void
    {
        $result = $this->withSession(['admin' => true])->post(
            '/admin/announcements',
            $this->withCsrf([
                'title' => 'State Override Attempt',
                'category' => 'General Announcement',
                'filed_at' => '2026-09-28 11:00:00',
                'state' => 'published',
            ])
        );

        $result->assertRedirect();

        $row = (new AnnouncementModel())->where('title', 'State Override Attempt')->first();
        $this->assertNotNull($row);
        $this->assertSame('pending_review', $row['state']);
        $this->assertNull($row['published_at']);
    }

    public function test_send_route_gone(): void
    {
        $id = $this->insertRow([
            'sgx_reference' => 'SENDGONE1',
            'slug' => 'send-gone',
            'title' => 'Send Gone',
            'state' => 'published',
        ]);

        $this->expectException(PageNotFoundException::class);
        $this->withSession(['admin' => true])->post(
            '/admin/announcements/' . $id . '/send',
            $this->withCsrf([])
        );
    }

    public function test_index_has_new_button_and_source_badge(): void
    {
        $this->insertRow([
            'sgx_reference' => 'SRC1',
            'slug' => 'source-badge',
            'title' => 'SGX Item',
            'source' => 'sgx',
            'state' => 'pending_review',
        ]);

        $list = $this->withSession(['admin' => true])->get('/admin/announcements');
        $list->assertOK();
        $body = $list->getBody();
        $this->assertStringContainsString('admin/announcements/new', $body);
        $this->assertStringContainsString('New announcement', $body);
        $this->assertStringContainsString('sgx', $body);
    }

    public function test_delete_removes_row(): void
    {
        $id = $this->insertRow([
            'sgx_reference' => 'DEL1',
            'slug' => 'delete-me',
            'title' => 'Delete Me',
            'source' => 'manual',
            'state' => 'pending_review',
        ]);

        $result = $this->withSession(['admin' => true])->post(
            '/admin/announcements/' . $id . '/delete',
            $this->withCsrf([])
        );
        $result->assertRedirectTo('/admin/announcements');
        $this->assertNull((new AnnouncementModel())->find($id));
    }

    public function test_show_has_no_send_or_email_compose_fields(): void
    {
        $id = $this->insertRow([
            'sgx_reference' => 'NOSEND1',
            'slug' => 'no-send',
            'title' => 'No Send',
            'source' => 'sgx',
            'state' => 'published',
        ]);

        $show = $this->withSession(['admin' => true])->get('/admin/announcements/' . $id);
        $show->assertOK();
        $body = $show->getBody();
        $this->assertStringNotContainsString('admin/announcements/' . $id . '/send', $body);
        $this->assertStringNotContainsString('name="email_subject"', $body);
        $this->assertStringNotContainsString('name="email_intro"', $body);
        $this->assertStringContainsString('admin/announcements/' . $id . '/delete', $body);
        $this->assertStringNotContainsString('Create Email Alert', $body);
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
            'source_hash' => str_repeat('a', 64),
            'summary' => 'Summary',
            'needs_review' => 1,
        ], $overrides));

        return (int) $model->getInsertID();
    }
}
