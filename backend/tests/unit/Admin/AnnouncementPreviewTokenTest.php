<?php
declare(strict_types=1);

namespace Tests\Unit\Admin;

use App\Libraries\Admin\AnnouncementPreviewToken;
use CodeIgniter\Test\CIUnitTestCase;
use Config\Admin;
use Config\EmailAlerts;
use InvalidArgumentException;

final class AnnouncementPreviewTokenTest extends CIUnitTestCase
{
    private const SECRET = 'unit-test-preview-secret-min-32chars!!';

    public function test_mint_roundtrip_and_rejects_tamper(): void
    {
        $tok = new AnnouncementPreviewToken(self::SECRET);
        $plain = $tok->mint(42);
        $this->assertSame(42, $tok->parse($plain));

        $parts = explode('.', $plain);
        $parts[0] = '99';
        $this->expectException(InvalidArgumentException::class);
        $tok->parse(implode('.', $parts));
    }

    public function test_expired_token_rejected(): void
    {
        $tok = new AnnouncementPreviewToken(self::SECRET);
        $exp = time() - 10;
        $payload = '7.' . $exp;
        $sig = hash_hmac('sha256', 'preview:' . $payload, self::SECRET);
        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage('expired');
        $tok->parse($payload . '.' . $sig);
    }

    public function test_page_url_shape(): void
    {
        $cfg = config(Admin::class);
        $cfg->fePublicOrigin = 'http://localhost:3000';
        $tok = new AnnouncementPreviewToken(self::SECRET);
        $plain = $tok->mint(3);
        $this->assertSame(
            'http://localhost:3000/investor-relations/company-announcement/preview?t=' . rawurlencode($plain),
            $tok->pageUrl($plain)
        );
    }

    public function test_from_config_falls_back_to_email_secret(): void
    {
        $admin = config(Admin::class);
        $admin->previewSecret = '';
        $email = config(EmailAlerts::class);
        $email->unsubscribeSecret = self::SECRET;

        $tok = AnnouncementPreviewToken::fromConfig();
        $this->assertSame(5, $tok->parse($tok->mint(5)));
    }

    public function test_short_secret_throws(): void
    {
        $this->expectException(InvalidArgumentException::class);
        new AnnouncementPreviewToken(str_repeat('a', 31));
    }
}
