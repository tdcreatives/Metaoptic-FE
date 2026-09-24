<?php
declare(strict_types=1);

namespace Tests\Feature\Api;

use App\Libraries\Email\UnsubscribeToken;
use App\Models\SubscriberModel;
use CodeIgniter\Config\Factories;
use CodeIgniter\Test\CIUnitTestCase;
use CodeIgniter\Test\DatabaseTestTrait;
use CodeIgniter\Test\FeatureTestTrait;
use Config\EmailAlerts;

final class UnsubscribeApiTest extends CIUnitTestCase
{
    use DatabaseTestTrait;
    use FeatureTestTrait;

    protected $migrate = true;
    protected $refresh = true;
    protected $namespace = 'App';

    private const SECRET = 'unit-test-secret-min-32-chars-long!!';

    protected function setUp(): void
    {
        parent::setUp();
        $_ENV['email.unsubscribeSecret'] = self::SECRET;
        putenv('email.unsubscribeSecret=' . self::SECRET);
        $cfg = new EmailAlerts();
        Factories::injectMock('config', EmailAlerts::class, $cfg);
        Factories::injectMock('config', 'EmailAlerts', $cfg);
    }

    protected function tearDown(): void
    {
        putenv('email.unsubscribeSecret');
        unset($_ENV['email.unsubscribeSecret'], $_SERVER['email.unsubscribeSecret']);
        parent::tearDown();
    }

    public function test_valid_token_unsubscribes_and_always_returns_ok(): void
    {
        $tokens = new UnsubscribeToken(self::SECRET);
        $id = $this->insertActive('join@example.com', $tokens);
        $plain = $tokens->forSubscriber($id);

        $result = $this->withBodyFormat('json')->post('/api/unsubscribe', [
            'token' => $plain,
        ]);

        $result->assertStatus(200);
        $this->assertSame(['ok' => true], json_decode((string) $result->getJSON(), true));

        $row = (new SubscriberModel())->find($id);
        $this->assertSame('unsubscribed', $row['status']);
        $this->assertSame('join@example.com', $row['email']);
        $this->assertNotNull($row['unsubscribed_at']);
    }

    public function test_invalid_token_still_ok_without_changing_rows(): void
    {
        $id = $this->insertActive('stay@example.com', new UnsubscribeToken(self::SECRET));

        $result = $this->withBodyFormat('json')->post('/api/unsubscribe', [
            'token' => 'garbage',
        ]);

        $result->assertStatus(200);
        $this->assertSame(['ok' => true], json_decode((string) $result->getJSON(), true));
        $this->assertSame('active', (new SubscriberModel())->find($id)['status']);
    }

    public function test_missing_token_still_ok(): void
    {
        $result = $this->withBodyFormat('json')->post('/api/unsubscribe', []);
        $result->assertStatus(200);
        $this->assertSame(['ok' => true], json_decode((string) $result->getJSON(), true));
    }

    public function test_cors_allows_configured_origin(): void
    {
        $origin = config('Sgx')->corsOrigins[0] ?? 'https://metaoptics.sg';
        $allowed = $this->withHeaders(['Origin' => $origin])
            ->withBodyFormat('json')
            ->post('/api/unsubscribe', ['token' => 'x']);
        $allowed->assertStatus(200);
        $allowed->assertHeader('Access-Control-Allow-Origin', $origin);

        $denied = $this->withHeaders(['Origin' => 'https://evil.example'])
            ->withBodyFormat('json')
            ->post('/api/unsubscribe', ['token' => 'x']);
        $denied->assertStatus(200);
        $denied->assertHeaderMissing('Access-Control-Allow-Origin');
    }

    public function test_options_preflight_returns_204_cors(): void
    {
        $origin = config('Sgx')->corsOrigins[0] ?? 'https://metaoptics.sg';
        $result = $this->withHeaders(['Origin' => $origin])->options('/api/unsubscribe');
        $result->assertStatus(204);
        $result->assertHeader('Access-Control-Allow-Origin', $origin);
        $result->assertHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
        $result->assertHeader('Access-Control-Allow-Headers', 'Content-Type');
        $result->assertHeader('Vary', 'Origin');
    }

    private function insertActive(string $email, UnsubscribeToken $tokens): int
    {
        $id = (int) (new SubscriberModel())->insert([
            'email' => $email,
            'status' => 'active',
            'consented_at' => '2026-01-01 00:00:00',
            'unsubscribed_at' => null,
            'unsubscribe_token_hash' => null,
        ], true);
        (new SubscriberModel())->update($id, [
            'unsubscribe_token_hash' => $tokens->hashPlain($tokens->forSubscriber($id)),
        ]);

        return $id;
    }
}
