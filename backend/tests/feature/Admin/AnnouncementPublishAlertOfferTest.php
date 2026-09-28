<?php
declare(strict_types=1);

namespace Tests\Feature\Admin;

use App\Models\AnnouncementModel;
use App\Models\EmailAlertModel;
use CodeIgniter\Test\CIUnitTestCase;
use CodeIgniter\Test\DatabaseTestTrait;
use CodeIgniter\Test\FeatureTestTrait;

final class AnnouncementPublishAlertOfferTest extends CIUnitTestCase
{
    use DatabaseTestTrait;
    use FeatureTestTrait;

    protected $migrate = true;
    protected $refresh = true;
    protected $namespace = 'App';

    public function test_publish_redirects_with_offer_alert_when_changed(): void
    {
        $id = $this->insertRow(['state' => 'pending_review', 'needs_review' => 1]);

        $result = $this->withSession(['admin' => true])->post(
            '/admin/announcements/' . $id . '/publish',
            $this->withCsrf([])
        );

        $result->assertRedirectTo('/admin/announcements/' . $id . '?offer_alert=1');
    }

    public function test_publish_already_published_has_no_offer_alert(): void
    {
        $id = $this->insertRow([
            'state' => 'published',
            'needs_review' => 0,
            'published_at' => '2026-09-28 10:00:00',
        ]);

        $result = $this->withSession(['admin' => true])->post(
            '/admin/announcements/' . $id . '/publish',
            $this->withCsrf([])
        );

        $result->assertRedirectTo('/admin/announcements/' . $id);
        $this->assertStringNotContainsString('offer_alert', (string) $result->getHeaderLine('Location'));
    }

    public function test_offer_alert_shows_modal_when_published(): void
    {
        $id = $this->insertRow(['state' => 'published', 'needs_review' => 0]);

        $show = $this->withSession(['admin' => true])->get(
            '/admin/announcements/' . $id . '?offer_alert=1'
        );
        $show->assertOK();
        $body = $show->getBody();
        $this->assertStringContainsString('Create Email Alert draft', $body);
        $this->assertStringContainsString('admin/announcements/' . $id . '/create-alert-draft', $body);
    }

    public function test_create_alert_draft_redirects_to_edit(): void
    {
        $id = $this->insertRow([
            'state' => 'published',
            'needs_review' => 0,
            'title' => 'Placement Notice',
            'summary' => 'Investor summary',
        ]);

        $result = $this->withSession(['admin' => true])->post(
            '/admin/announcements/' . $id . '/create-alert-draft',
            $this->withCsrf([])
        );

        $result->assertRedirect();
        $alert = (new EmailAlertModel())->where('subject', 'Placement Notice')->first();
        $this->assertNotNull($alert);
        $result->assertRedirectTo('/admin/email-alerts/' . $alert['id'] . '/edit');
    }

    public function test_create_alert_draft_without_csrf_does_not_mutate(): void
    {
        $id = $this->insertRow(['state' => 'published', 'needs_review' => 0]);

        $this->expectException(\CodeIgniter\Security\Exceptions\SecurityException::class);
        try {
            $this->withSession(['admin' => true])->post(
                '/admin/announcements/' . $id . '/create-alert-draft',
                []
            );
        } finally {
            $this->assertSame(0, (new EmailAlertModel())->countAllResults());
        }
    }

    public function test_layout_empty_strings_store_null(): void
    {
        $id = $this->insertRow([
            'state' => 'published',
            'needs_review' => 0,
            'title_btn' => 'Keep me',
            'title_btn_sm' => 'Keep sm',
            'title_banner' => 'Keep banner',
        ]);

        $result = $this->withSession(['admin' => true])->post(
            '/admin/announcements/' . $id . '/layout',
            $this->withCsrf([
                'title_btn' => '',
                'title_btn_sm' => '',
                'title_banner' => '',
            ])
        );

        $result->assertRedirectTo('/admin/announcements/' . $id);
        $row = (new AnnouncementModel())->find($id);
        $this->assertNull($row['title_btn']);
        $this->assertNull($row['title_btn_sm']);
        $this->assertNull($row['title_banner']);
    }

    public function test_new_alert_form_prefills_from_single_announcement(): void
    {
        $id = $this->insertRow([
            'state' => 'published',
            'needs_review' => 0,
            'title' => 'Prefill Subject Title',
            'summary' => 'Prefill intro text',
        ]);

        $form = $this->withSession(['admin' => true])->get(
            '/admin/email-alerts/new?announcement_id=' . $id
        );
        $form->assertOK();
        $body = $form->getBody();
        $this->assertStringContainsString('value="Prefill Subject Title"', $body);
        $this->assertStringContainsString('Prefill intro text', $body);
        $this->assertStringContainsString('{{announcement}}', $body);
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
            'sgx_reference' => 'PAO' . bin2hex(random_bytes(3)),
            'slug' => 'pao-' . bin2hex(random_bytes(3)),
            'source_url' => 'https://example.test/pao',
            'title' => 'Offer Item',
            'category' => 'General Announcement',
            'issuer' => 'MetaOptics Ltd',
            'filed_at' => '2026-09-28 09:00:00',
            'source_payload' => '{}',
            'source_hash' => hash('sha256', microtime()),
            'source' => 'manual',
            'summary' => 'Summary',
            'needs_review' => 1,
        ], $overrides));

        return (int) $model->getInsertID();
    }
}
