<?php
declare(strict_types=1);

namespace Tests\Feature\Admin;

use App\Models\AnnouncementModel;
use CodeIgniter\Config\Factories;
use CodeIgniter\Test\CIUnitTestCase;
use CodeIgniter\Test\DatabaseTestTrait;
use CodeIgniter\Test\FeatureTestTrait;
use Config\Admin;
use Config\EmailAlerts;

final class AnnouncementPreviewAdminTest extends CIUnitTestCase
{
    use DatabaseTestTrait;
    use FeatureTestTrait;

    protected $migrate = true;
    protected $refresh = true;
    protected $namespace = 'App';

    private const SECRET = 'admin-preview-secret-min-32-chars!!!';

    protected function setUp(): void
    {
        parent::setUp();
        $hash = password_hash('test-admin-pass', PASSWORD_DEFAULT);
        $_ENV['admin.username'] = 'ir-admin';
        $_ENV['admin.passwordHash'] = $hash;
        putenv('admin.username=ir-admin');
        putenv('admin.passwordHash=' . $hash);

        $admin = new Admin();
        $admin->username = 'ir-admin';
        $admin->passwordHash = $hash;
        $admin->previewSecret = self::SECRET;
        $admin->fePublicOrigin = 'http://localhost:3000';
        Factories::injectMock('config', Admin::class, $admin);
        Factories::injectMock('config', 'Admin', $admin);

        $email = new EmailAlerts();
        $email->unsubscribeSecret = self::SECRET;
        Factories::injectMock('config', EmailAlerts::class, $email);
        Factories::injectMock('config', 'EmailAlerts', $email);
    }

    protected function tearDown(): void
    {
        putenv('admin.username');
        putenv('admin.passwordHash');
        unset($_ENV['admin.username'], $_ENV['admin.passwordHash']);
        parent::tearDown();
    }

    public function test_list_shows_preview_for_pending_not_published(): void
    {
        $pendingId = $this->insertRow('pending_review', 'pending-list');
        $this->insertRow('published', 'published-list');

        $result = $this->withSession(['admin' => true])->get('/admin/announcements');
        $result->assertOK();
        $body = $result->getBody();
        $this->assertStringContainsString('admin/announcements/' . $pendingId . '/preview', $body);
        $this->assertStringContainsString('>Preview<', $body);
        // Published row must not get a preview link for its id.
        $publishedId = (int) (new AnnouncementModel())->where('slug', 'published-list')->first()['id'];
        $this->assertStringNotContainsString('admin/announcements/' . $publishedId . '/preview', $body);
    }

    public function test_preview_redirects_to_fe_with_token(): void
    {
        $id = $this->insertRow('pending_review', 'pending-redir');
        $result = $this->withSession(['admin' => true])->get('/admin/announcements/' . $id . '/preview');
        $result->assertRedirect();
        $this->assertStringStartsWith(
            'http://localhost:3000/investor-relations/company-announcement/preview?t=',
            (string) $result->getRedirectUrl()
        );
    }

    public function test_preview_rejects_published(): void
    {
        $id = $this->insertRow('published', 'published-no-prev');
        $result = $this->withSession(['admin' => true])->get('/admin/announcements/' . $id . '/preview');
        $result->assertRedirectTo('/admin/announcements/' . $id);
    }

    private function insertRow(string $state, string $slug): int
    {
        return (int) (new AnnouncementModel())->insert([
            'sgx_reference' => 'SGX' . substr(md5($slug), 0, 8),
            'slug' => $slug,
            'title' => 'Title ' . $slug,
            'category' => 'General Announcement',
            'filed_at' => '2025-09-16 09:30:00',
            'state' => $state,
            'published_at' => $state === 'published' ? '2025-09-16 10:00:00' : null,
            'source_url' => 'https://example.test/a',
            'issuer' => 'MetaOptics Ltd',
            'source_payload' => '{}',
            'source_hash' => str_repeat('d', 64),
            'needs_review' => 1,
        ]);
    }
}
