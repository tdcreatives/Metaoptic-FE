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

    public function test_create_form_has_category_dropdown_with_custom(): void
    {
        $form = $this->withSession(['admin' => true])->get('/admin/announcements/new');
        $form->assertOK();
        $body = $form->getBody();
        $this->assertStringContainsString('name="category_select"', $body);
        $this->assertStringContainsString('name="category_custom"', $body);
        $this->assertStringContainsString('Custom...', $body);
        $this->assertStringContainsString('General Announcement', $body);
    }

    public function test_create_with_custom_category_persists_to_catalog(): void
    {
        $tmp = WRITEPATH . 'email/test-custom-cats-' . bin2hex(random_bytes(4)) . '.json';
        \App\Libraries\Email\CategoryCatalog::setCustomPathForTests($tmp);
        try {
            $result = $this->withSession(['admin' => true])->post(
                '/admin/announcements',
                $this->withCsrf([
                    'title' => 'Custom Cat Note',
                    'category_select' => \App\Libraries\Email\CategoryCatalog::customMarker(),
                    'category_custom' => 'SGX Brand New Type',
                    'filed_at' => '2026-09-28 11:00:00',
                ])
            );
            $result->assertRedirect();

            $row = (new AnnouncementModel())->where('title', 'Custom Cat Note')->first();
            $this->assertNotNull($row);
            $this->assertSame('SGX Brand New Type', $row['category']);
            $this->assertContains('SGX Brand New Type', \App\Libraries\Email\CategoryCatalog::all());
        } finally {
            \App\Libraries\Email\CategoryCatalog::setCustomPathForTests(null);
            if (is_file($tmp)) {
                @unlink($tmp);
            }
        }
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

    public function test_create_and_update_fe_detail_fields(): void
    {
        $create = $this->withSession(['admin' => true])->post(
            '/admin/announcements',
            $this->withCsrf([
                'title' => 'FE Form Note',
                'category' => 'General Announcement',
                'filed_at' => '2026-09-28 12:00:00',
                'issuer_name' => 'MetaOptics Ltd',
                'ann_title' => 'Created Ann Title',
                'ann_description' => 'Created desc',
                'attachment_name' => ['A.pdf'],
                'attachment_url' => ['https://example.test/a.pdf'],
            ])
        );
        $create->assertRedirect();

        $row = (new AnnouncementModel())->where('title', 'FE Form Note')->first();
        $this->assertNotNull($row);
        $id = (int) $row['id'];
        $this->assertSame('MetaOptics Ltd', $row['issuer_name']);
        $this->assertSame('Created Ann Title', $row['ann_title']);

        $show = $this->withSession(['admin' => true])->get('/admin/announcements/' . $id);
        $show->assertOK();
        $body = $show->getBody();
        $this->assertStringContainsString('name="ann_title"', $body);
        $this->assertStringContainsString('name="issuer_name"', $body);
        $this->assertStringContainsString('admin/announcements/' . $id . '/update', $body);
        $this->assertStringContainsString('Created Ann Title', $body);

        $update = $this->withSession(['admin' => true])->post(
            '/admin/announcements/' . $id . '/update',
            $this->withCsrf([
                'title' => 'FE Form Note',
                'category' => 'General Announcement',
                'filed_at' => '2026-09-28 12:00:00',
                'issuer_name' => 'Updated Issuer',
                'ann_title' => 'Updated Ann Title',
                'ann_description' => 'Updated desc',
                'attachment_name' => ['B.pdf'],
                'attachment_url' => ['https://example.test/b.pdf'],
            ])
        );
        $update->assertRedirectTo('/admin/announcements/' . $id);

        $fresh = (new AnnouncementModel())->find($id);
        $this->assertSame('Updated Issuer', $fresh['issuer_name']);
        $this->assertSame('Updated Ann Title', $fresh['ann_title']);
        $this->assertSame('Updated desc', $fresh['ann_description']);

        $atts = db_connect()->table('announcement_attachments')
            ->where('announcement_id', $id)
            ->get()
            ->getResultArray();
        $this->assertCount(1, $atts);
        $this->assertSame('B.pdf', $atts[0]['name']);
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
            'published_at' => '2026-09-28 10:00:00',
            'live_at' => '2026-09-28 10:00:00',
        ]);

        $show = $this->withSession(['admin' => true])->get('/admin/announcements/' . $id);
        $show->assertOK();
        $body = $show->getBody();
        $this->assertStringNotContainsString('admin/announcements/' . $id . '/send', $body);
        $this->assertStringNotContainsString('name="email_subject"', $body);
        $this->assertStringNotContainsString('name="email_intro"', $body);
        $this->assertStringContainsString('admin/announcements/' . $id . '/delete', $body);
        $this->assertStringContainsString('Create Email Alert', $body);
        $this->assertStringContainsString('email-alerts/new?announcement_id=' . $id, $body);
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
