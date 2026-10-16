<?php
declare(strict_types=1);

namespace Tests\Unit\Http;

use App\Libraries\Http\TurnstileVerifier;
use CodeIgniter\Test\CIUnitTestCase;
use Config\Turnstile;

final class TurnstileVerifierTest extends CIUnitTestCase
{
    public function test_empty_token_fails_when_required(): void
    {
        $cfg = new Turnstile();
        $cfg->secretKey = 'test-secret';
        $v = new TurnstileVerifier($cfg, static fn () => ['success' => true]);
        $this->assertFalse($v->verify(''));
    }

    public function test_success_true_passes(): void
    {
        $cfg = new Turnstile();
        $cfg->secretKey = 'test-secret';
        $v = new TurnstileVerifier($cfg, static fn () => ['success' => true]);
        $this->assertTrue($v->verify('tok'));
    }

    public function test_success_false_fails(): void
    {
        $cfg = new Turnstile();
        $cfg->secretKey = 'test-secret';
        $v = new TurnstileVerifier($cfg, static fn () => ['success' => false]);
        $this->assertFalse($v->verify('tok'));
    }

    public function test_transport_receives_secret_and_token(): void
    {
        $cfg = new Turnstile();
        $cfg->secretKey = 'sec';
        $cfg->verifyURL = 'https://example.test/verify';
        $seen = null;
        $v = new TurnstileVerifier($cfg, static function (string $url, array $fields) use (&$seen) {
            $seen = [$url, $fields];
            return ['success' => true];
        });
        $v->verify('abc', '1.2.3.4');
        $this->assertSame('https://example.test/verify', $seen[0]);
        $this->assertSame('sec', $seen[1]['secret']);
        $this->assertSame('abc', $seen[1]['response']);
        $this->assertSame('1.2.3.4', $seen[1]['remoteip']);
    }

    public function test_bypass_when_secret_empty_in_testing(): void
    {
        $cfg = new Turnstile();
        $cfg->secretKey = '';
        $v = new TurnstileVerifier($cfg, static fn () => ['success' => false]);
        // ENVIRONMENT is testing under phpunit
        $this->assertFalse($v->isRequired());
        $this->assertTrue($v->verify(''));
    }
}
