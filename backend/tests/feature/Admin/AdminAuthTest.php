<?php
declare(strict_types=1);

namespace Tests\Feature\Admin;

use App\Models\AnnouncementModel;
use App\Models\AuditLogModel;
use CodeIgniter\Config\Factories;
use CodeIgniter\Test\CIUnitTestCase;
use CodeIgniter\Test\DatabaseTestTrait;
use CodeIgniter\Test\FeatureTestTrait;
use Config\Admin;

final class AdminAuthTest extends CIUnitTestCase
{
    use DatabaseTestTrait;
    use FeatureTestTrait;

    protected $migrate = true;
    protected $refresh = true;
    protected $namespace = 'App';

    private string $password = 'test-admin-pass';

    protected function setUp(): void
    {
        parent::setUp();

        $hash = password_hash($this->password, PASSWORD_DEFAULT);
        $_ENV['admin.username'] = 'ir-admin';
        $_ENV['admin.passwordHash'] = $hash;
        putenv('admin.username=ir-admin');
        putenv('admin.passwordHash=' . $hash);

        $cfg = new Admin();
        Factories::injectMock('config', Admin::class, $cfg);
        Factories::injectMock('config', 'Admin', $cfg);

        cache()->clean();
    }

    protected function tearDown(): void
    {
        putenv('admin.username');
        putenv('admin.passwordHash');
        unset($_ENV['admin.username'], $_ENV['admin.passwordHash']);
        cache()->clean();
        parent::tearDown();
    }

    public function test_bad_password_does_not_set_admin_session(): void
    {
        $this->get('/admin/login')->assertOK();

        $result = $this->withSession([])->post('/admin/login', $this->withCsrf([
            'username' => 'ir-admin',
            'password' => 'wrong-password',
        ]));

        $result->assertRedirect();
        $this->assertNotTrue(session('admin'));
        $this->assertNull((new AuditLogModel())->where('action', 'login')->first());
    }

    public function test_good_password_sets_admin_session_and_audits_login(): void
    {
        $this->get('/admin/login')->assertOK();

        $result = $this->withSession([])->post('/admin/login', $this->withCsrf([
            'username' => 'ir-admin',
            'password' => $this->password,
        ]));

        $result->assertRedirectTo('/admin');
        $this->assertTrue(session('admin'));

        $row = (new AuditLogModel())->where('action', 'login')->first();
        $this->assertNotNull($row);
        $this->assertSame('login', $row['action']);
    }

    public function test_dashboard_requires_auth_and_shows_counts(): void
    {
        $this->get('/admin')->assertRedirectTo('/admin/login');

        (new AnnouncementModel())->insert(array_merge($this->announcementDefaults(), [
            'sgx_reference' => 'PEND1',
            'slug' => 'pending-one',
            'state' => 'pending_review',
            'needs_review' => 1,
        ]));
        (new AnnouncementModel())->insert(array_merge($this->announcementDefaults(), [
            'sgx_reference' => 'PUB1',
            'slug' => 'published-one',
            'state' => 'published',
            'needs_review' => 0,
            'published_at' => '2025-09-15 10:00:00',
        ]));

        $dash = $this->withSession(['admin' => true])->get('/admin');
        $dash->assertOK();
        $this->assertMatchesRegularExpression('/pending[^0-9]*1/i', $dash->getBody());
        $this->assertMatchesRegularExpression('/published[^0-9]*1/i', $dash->getBody());
        $this->assertMatchesRegularExpression('/needs.?review[^0-9]*1/i', $dash->getBody());
    }

    public function test_logout_destroys_admin_session(): void
    {
        $this->get('/admin/login')->assertOK();
        $result = $this->withSession(['admin' => true])->post('/admin/logout', $this->withCsrf([]));
        $result->assertRedirectTo('/admin/login');
        $this->assertNotTrue(session('admin'));
    }

    public function test_login_rate_limited_after_five_failures(): void
    {
        $this->get('/admin/login')->assertOK();

        for ($i = 0; $i < 5; $i++) {
            $this->withSession([])->post('/admin/login', $this->withCsrf([
                'username' => 'ir-admin',
                'password' => 'wrong',
            ]));
        }

        $blocked = $this->withSession([])->post('/admin/login', $this->withCsrf([
            'username' => 'ir-admin',
            'password' => $this->password,
        ]));

        $blocked->assertRedirect();
        $this->assertNotTrue(session('admin'));
    }

    /** @param array<string, string> $fields */
    private function withCsrf(array $fields): array
    {
        helper('security');
        $fields[csrf_token()] = csrf_hash();

        return $fields;
    }

    /** @return array<string, mixed> */
    private function announcementDefaults(): array
    {
        return [
            'source_url' => 'https://example.test/a',
            'title' => 'Item',
            'category' => 'General Announcement',
            'issuer' => 'MetaOptics Ltd',
            'filed_at' => '2025-09-15 09:30:00',
            'source_payload' => '{}',
            'source_hash' => str_repeat('d', 64),
            'summary' => 'Summary',
        ];
    }
}
