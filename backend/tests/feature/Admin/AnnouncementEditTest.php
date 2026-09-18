<?php
declare(strict_types=1);

namespace Tests\Feature\Admin;

use App\Models\AnnouncementModel;
use App\Models\AuditLogModel;
use CodeIgniter\Exceptions\PageNotFoundException;
use CodeIgniter\Test\CIUnitTestCase;
use CodeIgniter\Test\DatabaseTestTrait;
use CodeIgniter\Test\FeatureTestTrait;

final class AnnouncementEditTest extends CIUnitTestCase
{
    use DatabaseTestTrait;
    use FeatureTestTrait;

    protected $migrate = true;
    protected $refresh = true;
    protected $namespace = 'App';

    public function test_announcements_require_auth(): void
    {
        $this->get('/admin/announcements')->assertRedirectTo('/admin/login');
        $this->get('/admin/announcements/1')->assertRedirectTo('/admin/login');
        $this->post('/admin/announcements/1/summary', $this->withCsrf([]))->assertRedirectTo('/admin/login');
        $this->post('/admin/announcements/1/archive', $this->withCsrf([]))->assertRedirectTo('/admin/login');
    }

    public function test_list_filters_by_state(): void
    {
        $this->insertRow([
            'sgx_reference' => 'PEND1',
            'slug' => 'pending-one',
            'title' => 'Pending Title',
            'state' => 'pending_review',
        ]);
        $this->insertRow([
            'sgx_reference' => 'PUB1',
            'slug' => 'published-one',
            'title' => 'Published Title',
            'state' => 'published',
        ]);

        $all = $this->withSession(['admin' => true])->get('/admin/announcements');
        $all->assertOK();
        $this->assertStringContainsString('Pending Title', $all->getBody());
        $this->assertStringContainsString('Published Title', $all->getBody());

        $pending = $this->withSession(['admin' => true])->get('/admin/announcements?state=pending_review');
        $pending->assertOK();
        $this->assertStringContainsString('Pending Title', $pending->getBody());
        $this->assertStringNotContainsString('Published Title', $pending->getBody());
    }

    public function test_show_escapes_and_disables_send_until_published(): void
    {
        $id = $this->insertRow([
            'sgx_reference' => 'XSS1',
            'slug' => 'xss-one',
            'title' => '<script>alert(1)</script>',
            'summary' => '<b>raw</b>',
            'state' => 'pending_review',
            'source_payload' => '{"k":"v"}',
        ]);

        $show = $this->withSession(['admin' => true])->get('/admin/announcements/' . $id);
        $show->assertOK();
        $body = $show->getBody();
        $this->assertStringNotContainsString('<script>alert(1)</script>', $body);
        $this->assertStringContainsString('&lt;script&gt;alert(1)&lt;/script&gt;', $body);
        $this->assertStringContainsString('"k": "v"', $body);
        $this->assertMatchesRegularExpression('/<button[^>]*disabled[^>]*>\\s*Send/i', $body);
    }

    public function test_update_summary_does_not_change_source_payload(): void
    {
        $originalPayload = '{"secret":true,"n":1}';
        $id = $this->insertRow([
            'sgx_reference' => 'EDIT1',
            'slug' => 'edit-one',
            'title' => 'Edit Me',
            'summary' => 'Old summary',
            'email_subject' => 'Old subject',
            'email_intro' => 'Old intro',
            'state' => 'pending_review',
            'source_payload' => $originalPayload,
        ]);

        $result = $this->withSession(['admin' => true])->post('/admin/announcements/' . $id . '/summary', $this->withCsrf([
            'summary' => 'New summary',
            'email_subject' => 'New subject',
            'email_intro' => 'New intro',
            'source_payload' => '{"hacked":true}',
            'state' => 'published',
            'title' => 'Hacked title',
        ]));

        $result->assertRedirectTo('/admin/announcements/' . $id);

        $row = (new AnnouncementModel())->find($id);
        $this->assertNotNull($row);
        $this->assertSame($originalPayload, $row['source_payload']);
        $this->assertSame('New summary', $row['summary']);
        $this->assertSame('New subject', $row['email_subject']);
        $this->assertSame('New intro', $row['email_intro']);
        $this->assertSame('pending_review', $row['state']);
        $this->assertSame('Edit Me', $row['title']);

        $audit = (new AuditLogModel())->where('action', 'summary_edit')->first();
        $this->assertNotNull($audit);
        $this->assertSame('announcement', $audit['entity_type']);
        $this->assertSame((string) $id, $audit['entity_id']);
    }

    public function test_update_summary_missing_id_is_404_and_does_not_audit(): void
    {
        $caught = false;
        try {
            $this->withSession(['admin' => true])->post(
                '/admin/announcements/99999/summary',
                $this->withCsrf([
                    'summary' => 'Ghost',
                    'email_subject' => 'Ghost subject',
                    'email_intro' => 'Ghost intro',
                ])
            );
        } catch (PageNotFoundException) {
            $caught = true;
        }

        $this->assertTrue($caught);
        $this->assertNull((new AuditLogModel())->where('action', 'summary_edit')->first());
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
            'source_hash' => str_repeat('e', 64),
            'summary' => 'Summary',
            'needs_review' => 1,
        ], $overrides));

        return (int) $model->getInsertID();
    }
}
