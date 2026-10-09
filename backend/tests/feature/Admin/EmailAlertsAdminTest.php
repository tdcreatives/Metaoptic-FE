<?php
declare(strict_types=1);

namespace Tests\Feature\Admin;

use App\Models\AnnouncementModel;
use App\Models\EmailAlertModel;
use CodeIgniter\Test\CIUnitTestCase;
use CodeIgniter\Test\DatabaseTestTrait;
use CodeIgniter\Test\FeatureTestTrait;

final class EmailAlertsAdminTest extends CIUnitTestCase
{
    use DatabaseTestTrait;
    use FeatureTestTrait;

    protected $migrate = true;
    protected $refresh = true;
    protected $namespace = 'App';

    public function test_authed_list_contains_email_alerts(): void
    {
        $list = $this->withSession(['admin' => true])->get('/admin/email-alerts');
        $list->assertOK();
        $this->assertStringContainsString('Email Alerts', $list->getBody());
    }

    public function test_create_draft_redirects_and_show_has_subject(): void
    {
        $result = $this->withSession(['admin' => true])->post(
            '/admin/email-alerts',
            $this->withCsrf([
                'subject' => 'Q3 IR blast',
                'body_html' => '<p>{{announcement}}</p>',
            ])
        );

        $result->assertRedirect();

        $row = (new EmailAlertModel())->where('subject', 'Q3 IR blast')->first();
        $this->assertNotNull($row);
        $this->assertSame('draft', $row['status']);
        $result->assertRedirectTo('/admin/email-alerts/' . $row['id']);

        $show = $this->withSession(['admin' => true])->get('/admin/email-alerts/' . $row['id']);
        $show->assertOK();
        $body = $show->getBody();
        $this->assertStringContainsString('Q3 IR blast', $body);
        $this->assertStringContainsString('Workflow', $body);
        $this->assertStringContainsString('Send now', $body);
        $this->assertStringContainsString('Edit draft', $body);
        $this->assertStringNotContainsString('>Open</span>', $body); // no fake open/click metric cards

        $audit = db_connect()->table('audit_log')
            ->where('action', 'create')
            ->where('entity_type', 'email_alert')
            ->where('entity_id', (string) $row['id'])
            ->get()
            ->getRowArray();
        $this->assertNotNull($audit);
    }

    public function test_new_form_has_tinymce_and_preselects_announcement(): void
    {
        $id = $this->insertPublished();

        $form = $this->withSession(['admin' => true])->get(
            '/admin/email-alerts/new?announcement_id=' . $id
        );
        $form->assertOK();
        $body = $form->getBody();
        $this->assertStringContainsString('tinymce.min.js', $body);
        $this->assertStringContainsString('admin-alert-editor.js', $body);
        $this->assertStringContainsString('name="announcement_ids[]"', $body);
        $this->assertStringContainsString('value="' . $id . '"', $body);
        $this->assertStringContainsString('checked', $body);
        $this->assertStringContainsString('id="attach_q"', $body);
        $this->assertStringContainsString('id="attach_category"', $body);
        $this->assertStringContainsString('Published only', $body);
    }

    public function test_attach_list_shows_published_not_pending(): void
    {
        $pubId = $this->insertPublished();
        (new AnnouncementModel())->insert([
            'sgx_reference' => 'PENDING-ATTACH',
            'slug' => 'pending-attach',
            'source_url' => 'https://example.test/pending',
            'title' => 'Pending Must Stay Hidden',
            'category' => 'General Announcement',
            'issuer' => 'MetaOptics Ltd',
            'filed_at' => '2026-09-28 09:00:00',
            'source_payload' => '{}',
            'source_hash' => str_repeat('b', 64),
            'source' => 'manual',
            'summary' => 'Summary',
            'state' => 'pending_review',
            'needs_review' => 1,
        ]);

        $form = $this->withSession(['admin' => true])->get('/admin/email-alerts/new');
        $form->assertOK();
        $body = $form->getBody();
        $this->assertStringContainsString('value="' . $pubId . '"', $body);
        $this->assertStringContainsString('Published for alert', $body);
        $this->assertStringNotContainsString('Pending Must Stay Hidden', $body);
    }

    public function test_blank_new_form_prefills_sample_body(): void
    {
        $form = $this->withSession(['admin' => true])->get('/admin/email-alerts/new');
        $form->assertOK();
        $body = $form->getBody();
        $this->assertStringContainsString('Dear Investor', $body);
        $this->assertStringContainsString('{{announcement}}', $body);
        $this->assertStringContainsString('MetaOptics Investor Relations', $body);
        $this->assertMatchesRegularExpression('/name="subject"[^>]*value=""/', $body);
    }

    public function test_published_announcement_links_to_new_alert(): void
    {
        $id = $this->insertPublished();

        $show = $this->withSession(['admin' => true])->get('/admin/announcements/' . $id);
        $show->assertOK();
        $body = $show->getBody();
        $this->assertStringContainsString('Create Email Alert', $body);
        $this->assertStringContainsString('email-alerts/new?announcement_id=' . $id, $body);
    }

    public function test_dashboard_shows_alert_status_counts(): void
    {
        (new EmailAlertModel())->insert([
            'subject' => 'Draft one',
            'body_html' => '<p>x</p>',
            'status' => 'draft',
        ]);

        $dash = $this->withSession(['admin' => true])->get('/admin');
        $dash->assertOK();
        $body = $dash->getBody();
        $this->assertStringContainsString('Alert drafts', $body);
        $this->assertStringContainsString('1', $body);
    }

    /** @param array<string, string> $fields */
    private function withCsrf(array $fields): array
    {
        helper('security');
        $fields[csrf_token()] = csrf_hash();

        return $fields;
    }

    private function insertPublished(): int
    {
        $model = new AnnouncementModel();
        $model->insert([
            'sgx_reference' => 'EAUI1',
            'slug' => 'email-alert-ui',
            'source_url' => 'https://example.test/ea',
            'title' => 'Published for alert',
            'category' => 'General Announcement',
            'issuer' => 'MetaOptics Ltd',
            'filed_at' => '2026-09-28 09:00:00',
            'source_payload' => '{}',
            'source_hash' => str_repeat('a', 64),
            'source' => 'manual',
            'summary' => 'Summary',
            'state' => 'published',
            'published_at' => '2026-09-28 10:00:00',
            'live_at' => '2026-09-28 10:00:00',
            'needs_review' => 0,
        ]);

        return (int) $model->getInsertID();
    }
}
