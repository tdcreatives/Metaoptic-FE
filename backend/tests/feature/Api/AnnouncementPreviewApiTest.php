<?php
declare(strict_types=1);

namespace Tests\Feature\Api;

use App\Libraries\Admin\AnnouncementPreviewToken;
use App\Models\AnnouncementModel;
use CodeIgniter\Config\Factories;
use CodeIgniter\Test\CIUnitTestCase;
use CodeIgniter\Test\DatabaseTestTrait;
use CodeIgniter\Test\FeatureTestTrait;
use Config\Admin;
use Config\EmailAlerts;

final class AnnouncementPreviewApiTest extends CIUnitTestCase
{
    use DatabaseTestTrait;
    use FeatureTestTrait;

    protected $migrate = true;
    protected $refresh = true;
    protected $namespace = 'App';

    private const SECRET = 'feature-preview-secret-min-32-chars!!';

    protected function setUp(): void
    {
        parent::setUp();
        $admin = new Admin();
        $admin->previewSecret = self::SECRET;
        $admin->fePublicOrigin = 'http://localhost:3000';
        Factories::injectMock('config', Admin::class, $admin);
        Factories::injectMock('config', 'Admin', $admin);

        $email = new EmailAlerts();
        $email->unsubscribeSecret = self::SECRET;
        Factories::injectMock('config', EmailAlerts::class, $email);
        Factories::injectMock('config', 'EmailAlerts', $email);
    }

    public function test_preview_returns_pending_with_valid_token(): void
    {
        $id = $this->insertPending();
        $token = (new AnnouncementPreviewToken(self::SECRET))->mint($id);

        $result = $this->get('/api/announcements/preview?t=' . rawurlencode($token));
        $result->assertOK();
        $json = json_decode((string) $result->getJSON(), true);
        $this->assertSame('pending-preview', $json['data']['slug']);
        $this->assertTrue($json['meta']['preview']);
        $this->assertSame('pending_review', $json['meta']['state']);
        $this->assertArrayNotHasKey('source_payload', $json['data']);
    }

    public function test_preview_rejects_bad_and_missing_token(): void
    {
        $this->insertPending();
        $this->get('/api/announcements/preview')->assertStatus(404);
        $this->get('/api/announcements/preview?t=not-a-token')->assertStatus(404);
    }

    public function test_preview_expired_returns_410(): void
    {
        $id = $this->insertPending();
        $exp = time() - 5;
        $payload = $id . '.' . $exp;
        $sig = hash_hmac('sha256', 'preview:' . $payload, self::SECRET);
        $this->get('/api/announcements/preview?t=' . rawurlencode($payload . '.' . $sig))->assertStatus(410);
    }

    public function test_slug_show_still_hides_pending(): void
    {
        $this->insertPending();
        $this->get('/api/announcements/pending-preview')->assertStatus(404);
    }

    private function insertPending(): int
    {
        return (int) (new AnnouncementModel())->insert([
            'sgx_reference' => 'SGXPREV',
            'slug' => 'pending-preview',
            'title' => 'Pending Preview',
            'category' => 'General Announcement',
            'filed_at' => '2025-09-16 09:30:00',
            'state' => 'pending_review',
            'source_url' => 'https://example.test/a',
            'issuer' => 'MetaOptics Ltd',
            'source_payload' => '{"secret":true}',
            'source_hash' => str_repeat('c', 64),
            'needs_review' => 1,
        ]);
    }
}
