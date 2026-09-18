<?php
declare(strict_types=1);

namespace Tests\Unit\Admin;

use App\Filters\AdminAuthFilter;
use CodeIgniter\HTTP\RedirectResponse;
use CodeIgniter\Test\CIUnitTestCase;
use Config\Admin;
use Config\Cookie;
use Config\Filters;
use Config\Session;

final class AdminConfigTest extends CIUnitTestCase
{
    protected function tearDown(): void
    {
        putenv('admin.username');
        putenv('admin.passwordHash');
        unset($_ENV['admin.username'], $_ENV['admin.passwordHash'], $_SERVER['admin.username'], $_SERVER['admin.passwordHash']);
        parent::tearDown();
    }

    public function test_admin_config_reads_username(): void
    {
        $_ENV['admin.username'] = 'ir-admin';
        $_ENV['admin.passwordHash'] = '$2y$10$placeholder';
        putenv('admin.username=ir-admin');
        putenv('admin.passwordHash=$2y$10$placeholder');

        $cfg = new Admin();

        $this->assertSame('ir-admin', $cfg->username);
        $this->assertSame('$2y$10$placeholder', $cfg->passwordHash);
        $this->assertSame('ir-admin', $cfg->username());
        $this->assertSame('$2y$10$placeholder', $cfg->passwordHash());
    }

    public function test_session_cookie_flags(): void
    {
        $session = new Session();
        $this->assertTrue($session->cookieHTTPOnly);
        $this->assertSame('Strict', $session->cookieSameSite);
        $this->assertSame(ENVIRONMENT === 'production', $session->cookieSecure);

        $cookie = new Cookie();
        $this->assertTrue($cookie->httponly);
        $this->assertSame('Strict', $cookie->samesite);
        $this->assertSame(ENVIRONMENT === 'production', $cookie->secure);
    }

    public function test_admin_auth_filter_alias_and_redirect(): void
    {
        $filters = new Filters();
        $this->assertSame(AdminAuthFilter::class, $filters->aliases['adminAuth']);

        service('session')->remove('admin');
        $result = (new AdminAuthFilter())->before(service('request'));
        $this->assertInstanceOf(RedirectResponse::class, $result);
        $this->assertStringContainsString('/admin/login', $result->getHeaderLine('Location'));
    }

    public function test_admin_auth_filter_allows_when_session_set(): void
    {
        service('session')->set('admin', true);
        $result = (new AdminAuthFilter())->before(service('request'));
        $this->assertNull($result);
        service('session')->remove('admin');
    }
}
