<?php
declare(strict_types=1);

namespace Tests\Feature\Api;

use App\Libraries\Email\MailerInterface;
use App\Libraries\Email\MailMessage;
use App\Libraries\Http\TurnstileVerifier;
use App\Models\SubscriberModel;
use CodeIgniter\Config\Factories;
use CodeIgniter\Test\CIUnitTestCase;
use CodeIgniter\Test\DatabaseTestTrait;
use CodeIgniter\Test\FeatureTestTrait;
use Config\EmailAlerts;
use Config\Services;
use Config\Turnstile;

final class SubscribeApiTest extends CIUnitTestCase
{
    use DatabaseTestTrait;
    use FeatureTestTrait;

    protected $migrate = true;
    protected $refresh = true;
    protected $namespace = 'App';

    private MailerInterface $mailer;

    protected function setUp(): void
    {
        parent::setUp();
        cache()->clean();
        $_ENV['email.unsubscribeSecret'] = 'unit-test-secret-min-32-chars-long!!';
        $_ENV['email.publicSiteURL'] = 'https://metaoptics.sg';
        putenv('email.unsubscribeSecret=unit-test-secret-min-32-chars-long!!');
        putenv('email.publicSiteURL=https://metaoptics.sg');
        $cfg = new EmailAlerts();
        Factories::injectMock('config', EmailAlerts::class, $cfg);
        Factories::injectMock('config', 'EmailAlerts', $cfg);

        $this->mailer = new class implements MailerInterface {
            /** @var list<MailMessage> */
            public array $sent = [];

            public function send(MailMessage $message): string
            {
                $this->sent[] = $message;

                return 'msg-1';
            }
        };
        Services::injectMock('mailer', $this->mailer);

        $tcfg = new Turnstile();
        $tcfg->secretKey = 'test-secret';
        Factories::injectMock('config', Turnstile::class, $tcfg);
        Factories::injectMock('config', 'Turnstile', $tcfg);
        $verifier = new TurnstileVerifier($tcfg, static function (string $url, array $fields): array {
            return ['success' => ($fields['response'] ?? '') === 'valid-token'];
        });
        Services::injectMock('turnstileVerifier', $verifier);
    }

    protected function tearDown(): void
    {
        putenv('email.unsubscribeSecret');
        putenv('email.publicSiteURL');
        unset(
            $_ENV['email.unsubscribeSecret'],
            $_SERVER['email.unsubscribeSecret'],
            $_ENV['email.publicSiteURL'],
            $_SERVER['email.publicSiteURL']
        );
        Services::reset(true);
        cache()->clean();
        parent::tearDown();
    }

    public function test_post_creates_active_and_always_returns_ok(): void
    {
        $result = $this->withBodyFormat('json')->post('/api/subscribers', [
            'email' => 'join@example.com',
            'first_name' => 'Jo',
            'categories' => ['General Announcement'],
            'website' => '',
            'turnstileToken' => 'valid-token',
        ]);

        $result->assertStatus(200);
        $this->assertSame(['ok' => true], json_decode((string) $result->getJSON(), true));

        $row = (new SubscriberModel())->where('email', 'join@example.com')->first();
        $this->assertNotNull($row);
        $this->assertSame('active', $row['status']);
        $this->assertCount(1, $this->mailer->sent);
    }

    public function test_honeypot_returns_ok_without_insert(): void
    {
        $result = $this->withBodyFormat('json')->post('/api/subscribers', [
            'email' => 'trap@example.com',
            'categories' => ['General Announcement'],
            'website' => 'http://bots.example',
            'turnstileToken' => 'valid-token',
        ]);

        $result->assertStatus(200);
        $this->assertSame(['ok' => true], json_decode((string) $result->getJSON(), true));
        $this->assertNull((new SubscriberModel())->where('email', 'trap@example.com')->first());
        $this->assertSame([], $this->mailer->sent);
    }

    public function test_bad_email_and_invalid_category_still_ok(): void
    {
        $bad = $this->withBodyFormat('json')->post('/api/subscribers', [
            'email' => 'nope',
            'categories' => ['General Announcement'],
            'website' => '',
            'turnstileToken' => 'valid-token',
        ]);
        $bad->assertStatus(200);
        $this->assertSame(['ok' => true], json_decode((string) $bad->getJSON(), true));

        $cat = $this->withBodyFormat('json')->post('/api/subscribers', [
            'email' => 'ok@example.com',
            'categories' => ['Nope'],
            'website' => '',
            'turnstileToken' => 'valid-token',
        ]);
        $cat->assertStatus(200);
        $this->assertSame([], (new SubscriberModel())->findAll());
    }

    public function test_cors_allows_configured_origin(): void
    {
        $origin = config('Sgx')->corsOrigins[0] ?? 'https://metaoptics.sg';
        $allowed = $this->withHeaders(['Origin' => $origin])
            ->withBodyFormat('json')
            ->post('/api/subscribers', [
                'email' => 'cors@example.com',
                'categories' => ['General Announcement'],
                'website' => '',
                'turnstileToken' => 'valid-token',
            ]);
        $allowed->assertStatus(200);
        $allowed->assertHeader('Access-Control-Allow-Origin', $origin);

        $denied = $this->withHeaders(['Origin' => 'https://evil.example'])
            ->withBodyFormat('json')
            ->post('/api/subscribers', [
                'email' => 'cors2@example.com',
                'categories' => ['General Announcement'],
                'website' => '',
                'turnstileToken' => 'valid-token',
            ]);
        $denied->assertStatus(200);
        $denied->assertHeaderMissing('Access-Control-Allow-Origin');
    }

    public function test_eleventh_request_from_same_ip_is_ok_noop(): void
    {
        for ($i = 1; $i <= 10; $i++) {
            $this->withBodyFormat('json')->post('/api/subscribers', [
                'email' => "u{$i}@example.com",
                'categories' => ['General Announcement'],
                'website' => '',
                'turnstileToken' => 'valid-token',
            ])->assertStatus(200);
        }

        $this->assertSame(10, (new SubscriberModel())->countAllResults());

        $eleventh = $this->withBodyFormat('json')->post('/api/subscribers', [
            'email' => 'u11@example.com',
            'categories' => ['General Announcement'],
            'website' => '',
        ]);
        $eleventh->assertStatus(200);
        $this->assertSame(['ok' => true], json_decode((string) $eleventh->getJSON(), true));
        $this->assertNull((new SubscriberModel())->where('email', 'u11@example.com')->first());
        $this->assertSame(10, (new SubscriberModel())->countAllResults());
    }

    public function test_empty_categories_returns_ok_without_insert(): void
    {
        $result = $this->withBodyFormat('json')->post('/api/subscribers', [
            'email' => 'empty-cats@example.com',
            'categories' => [],
            'website' => '',
            'turnstileToken' => 'valid-token',
        ]);
        $result->assertStatus(200);
        $this->assertSame(['ok' => true], json_decode((string) $result->getJSON(), true));
        $this->assertNull((new SubscriberModel())->where('email', 'empty-cats@example.com')->first());
    }

    public function test_options_preflight_returns_204_cors(): void
    {
        $origin = config('Sgx')->corsOrigins[0] ?? 'https://metaoptics.sg';
        $result = $this->withHeaders(['Origin' => $origin])->options('/api/subscribers');
        $result->assertStatus(204);
        $result->assertHeader('Access-Control-Allow-Origin', $origin);
        $result->assertHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
        $result->assertHeader('Access-Control-Allow-Headers', 'Content-Type');
        $result->assertHeader('Vary', 'Origin');
    }

    public function test_mailer_failure_still_ok_and_logs_without_email(): void
    {
        $this->mailer = new class implements MailerInterface {
            public function send(MailMessage $message): string
            {
                throw new \RuntimeException('smtp down');
            }
        };
        Services::injectMock('mailer', $this->mailer);

        $result = $this->withBodyFormat('json')->post('/api/subscribers', [
            'email' => 'fail@example.com',
            'categories' => ['General Announcement'],
            'website' => '',
            'turnstileToken' => 'valid-token',
        ]);
        $result->assertStatus(200);
        $this->assertSame(['ok' => true], json_decode((string) $result->getJSON(), true));
        $this->assertLogContains('error', 'subscribers.create failed');
        $this->assertFalse(
            \CodeIgniter\Test\TestLogger::didLog('error', 'fail@example.com', false),
            'log must not contain the subscriber email'
        );
    }

    public function test_empty_env_secret_still_persists_via_config_fallback(): void
    {
        putenv('email.unsubscribeSecret');
        unset($_ENV['email.unsubscribeSecret'], $_SERVER['email.unsubscribeSecret']);
        $cfg = new EmailAlerts();
        Factories::injectMock('config', EmailAlerts::class, $cfg);
        Factories::injectMock('config', 'EmailAlerts', $cfg);
        $this->assertNotSame('', $cfg->unsubscribeSecret);
        $this->assertGreaterThanOrEqual(32, strlen($cfg->unsubscribeSecret));

        $result = $this->withBodyFormat('json')->post('/api/subscribers', [
            'email' => 'fallback-secret@example.com',
            'first_name' => 'Fallback',
            'categories' => ['General Announcement'],
            'website' => '',
            'turnstileToken' => 'valid-token',
        ]);
        $result->assertStatus(200);
        $this->assertSame(['ok' => true], json_decode((string) $result->getJSON(), true));

        $row = (new SubscriberModel())->where('email', 'fallback-secret@example.com')->first();
        $this->assertNotNull($row, 'empty email.unsubscribeSecret must not silently skip DB write in testing/development');
        $this->assertSame('active', $row['status']);
    }

    public function test_short_secret_returns_ok_without_insert_and_logs_reason(): void
    {
        $cfg = new EmailAlerts();
        $cfg->unsubscribeSecret = 'too-short';
        Factories::injectMock('config', EmailAlerts::class, $cfg);
        Factories::injectMock('config', 'EmailAlerts', $cfg);

        $result = $this->withBodyFormat('json')->post('/api/subscribers', [
            'email' => 'short-secret@example.com',
            'categories' => ['General Announcement'],
            'website' => '',
            'turnstileToken' => 'valid-token',
        ]);
        $result->assertStatus(200);
        $this->assertSame(['ok' => true], json_decode((string) $result->getJSON(), true));
        $this->assertNull((new SubscriberModel())->where('email', 'short-secret@example.com')->first());
        $this->assertLogContains('error', 'unsubscribe secret must be at least 32 characters');
    }

    public function test_missing_turnstile_returns_ok_without_insert(): void
    {
        $result = $this->withBodyFormat('json')->post('/api/subscribers', [
            'email' => 'notoken@example.com',
            'categories' => ['General Announcement'],
            'website' => '',
        ]);
        $result->assertStatus(200);
        $this->assertNull((new SubscriberModel())->where('email', 'notoken@example.com')->first());
        $this->assertSame([], $this->mailer->sent);
    }

    public function test_invalid_turnstile_returns_ok_without_insert(): void
    {
        $result = $this->withBodyFormat('json')->post('/api/subscribers', [
            'email' => 'badtok@example.com',
            'categories' => ['General Announcement'],
            'website' => '',
            'turnstileToken' => 'nope',
        ]);
        $result->assertStatus(200);
        $this->assertNull((new SubscriberModel())->where('email', 'badtok@example.com')->first());
    }
}
