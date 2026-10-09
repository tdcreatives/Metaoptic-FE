<?php
declare(strict_types=1);

namespace Tests\Feature\Admin;

use App\Models\SubscriberCategoryModel;
use App\Models\SubscriberModel;
use CodeIgniter\Test\CIUnitTestCase;
use CodeIgniter\Test\DatabaseTestTrait;
use CodeIgniter\Test\FeatureTestTrait;

final class SubscribersAdminTest extends CIUnitTestCase
{
    use DatabaseTestTrait;
    use FeatureTestTrait;

    protected $migrate = true;
    protected $refresh = true;
    protected $namespace = 'App';

    public function test_list_shows_subscriber_without_token(): void
    {
        $this->seed('visible@example.test');

        $list = $this->withSession(['admin' => true])->get('/admin/subscribers');
        $list->assertOK();
        $body = $list->getBody();
        $this->assertStringContainsString('Subscribers', $body);
        $this->assertStringContainsString('visible@example.test', $body);
        $this->assertStringContainsString('General Announcement', $body);
        $this->assertStringContainsString('Unsubscribe', $body);
        $this->assertStringContainsString('Apply filters', $body);
        $this->assertStringContainsString('badge-sub-active', $body);
        $this->assertStringContainsString('btn-primary', $body);
        $this->assertStringNotContainsString('unsubscribe_token', $body);
        $this->assertStringNotContainsString(hash('sha256', 'visible@example.test'), $body);
    }

    public function test_mark_unsubscribed_via_post(): void
    {
        $id = $this->seed('gone@example.test');

        $result = $this->withSession(['admin' => true])->post(
            '/admin/subscribers/' . $id . '/unsubscribe',
            $this->withCsrf([])
        );
        $result->assertRedirectTo('/admin/subscribers');

        $row = (new SubscriberModel())->find($id);
        $this->assertSame('unsubscribed', $row['status']);

        $list = $this->withSession(['admin' => true])->get('/admin/subscribers?status=unsubscribed');
        $list->assertOK();
        $this->assertStringContainsString('gone@example.test', $list->getBody());
        $this->assertStringNotContainsString(
            'action="' . site_url('admin/subscribers/' . $id . '/unsubscribe') . '"',
            $list->getBody()
        );
    }

    public function test_export_csv(): void
    {
        $this->seed('csv-out@example.test');

        $export = $this->withSession(['admin' => true])->get('/admin/subscribers/export');
        $export->assertOK();
        $body = $export->getBody();
        $this->assertStringContainsString('csv-out@example.test', $body);
        $this->assertStringContainsString('email,first_name', $body);
    }

    public function test_dashboard_shows_active_count(): void
    {
        $this->seed('dash@example.test');

        $dash = $this->withSession(['admin' => true])->get('/admin');
        $dash->assertOK();
        $body = $dash->getBody();
        $this->assertStringContainsString('Active subscribers', $body);
        $this->assertStringContainsString('admin/subscribers', $body);
    }

    /** @param array<string, string> $fields */
    private function withCsrf(array $fields): array
    {
        helper('security');
        $fields[csrf_token()] = csrf_hash();

        return $fields;
    }

    private function seed(string $email): int
    {
        $id = (int) (new SubscriberModel())->insert([
            'email' => $email,
            'first_name' => 'Dash',
            'last_name' => 'Board',
            'status' => 'active',
            'consented_at' => '2026-10-03 00:00:00',
            'unsubscribe_token_hash' => hash('sha256', $email),
        ], true);
        (new SubscriberCategoryModel())->insert([
            'subscriber_id' => $id,
            'category_key' => 'General Announcement',
        ]);

        return $id;
    }
}
