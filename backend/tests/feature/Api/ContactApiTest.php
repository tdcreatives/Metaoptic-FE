<?php
declare(strict_types=1);

namespace Tests\Feature\Api;

use App\Libraries\Http\TurnstileVerifier;
use App\Libraries\Http\Web3FormsClient;
use CodeIgniter\Config\Factories;
use CodeIgniter\Test\CIUnitTestCase;
use CodeIgniter\Test\FeatureTestTrait;
use Config\Services;
use Config\Turnstile;

final class ContactApiTest extends CIUnitTestCase
{
    use FeatureTestTrait;

    /** @var list<array{url:string,payload:array}> */
    private array $forwarded = [];

    protected function setUp(): void
    {
        parent::setUp();
        $this->forwarded = [];
        $_ENV['web3forms.mainAccessKey'] = 'main-key';
        $_ENV['web3forms.irAccessKey'] = 'ir-key';
        putenv('web3forms.mainAccessKey=main-key');
        putenv('web3forms.irAccessKey=ir-key');

        $tcfg = new Turnstile();
        $tcfg->secretKey = 'test-secret';
        Factories::injectMock('config', Turnstile::class, $tcfg);
        Factories::injectMock('config', 'Turnstile', $tcfg);
        Services::injectMock(
            'turnstileVerifier',
            new TurnstileVerifier($tcfg, static fn ($u, $f) => ['success' => ($f['response'] ?? '') === 'valid-token'])
        );
    }

    protected function tearDown(): void
    {
        putenv('web3forms.mainAccessKey');
        putenv('web3forms.irAccessKey');
        unset($_ENV['web3forms.mainAccessKey'], $_ENV['web3forms.irAccessKey']);
        Services::reset(true);
        parent::tearDown();
    }

    public function test_rejects_invalid_turnstile(): void
    {
        $result = $this->withBodyFormat('json')->post('/api/contact', [
            'channel' => 'main',
            'turnstileToken' => 'bad',
            'fullName' => 'A',
            'email' => 'a@example.com',
            'message' => 'Hi',
        ]);
        $result->assertStatus(400);
        $body = json_decode((string) $result->getJSON(), true);
        $this->assertFalse($body['ok']);
    }

    public function test_accepts_valid_payload_shape(): void
    {
        $test = $this;
        Services::injectMock(
            'web3FormsClient',
            new Web3FormsClient(static function (array $payload) use ($test): array {
                $test->forwarded[] = ['url' => 'https://api.web3forms.com/submit', 'payload' => $payload];

                return ['ok' => true];
            })
        );

        $result = $this->withBodyFormat('json')->post('/api/contact', [
            'channel' => 'main',
            'turnstileToken' => 'valid-token',
            'fullName' => 'A',
            'email' => 'a@example.com',
            'phone' => '1234567890',
            'subject' => 'Hello',
            'message' => 'Hi',
        ]);
        $result->assertStatus(200);
        $body = json_decode((string) $result->getJSON(), true);
        $this->assertTrue($body['ok']);
        $this->assertCount(1, $this->forwarded);
        $this->assertSame('main-key', $this->forwarded[0]['payload']['access_key']);
    }
}
