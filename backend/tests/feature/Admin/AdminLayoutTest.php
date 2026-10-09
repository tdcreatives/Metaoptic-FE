<?php
declare(strict_types=1);

namespace Tests\Feature\Admin;

use CodeIgniter\Config\Factories;
use CodeIgniter\Test\CIUnitTestCase;
use CodeIgniter\Test\DatabaseTestTrait;
use CodeIgniter\Test\FeatureTestTrait;
use Config\Admin;

final class AdminLayoutTest extends CIUnitTestCase
{
    use DatabaseTestTrait;
    use FeatureTestTrait;

    protected $migrate = true;
    protected $refresh = true;
    protected $namespace = 'App';

    protected function setUp(): void
    {
        parent::setUp();
        $hash = password_hash('test-admin-pass', PASSWORD_DEFAULT);
        $_ENV['admin.username'] = 'ir-admin';
        $_ENV['admin.passwordHash'] = $hash;
        putenv('admin.username=ir-admin');
        putenv('admin.passwordHash=' . $hash);
        $cfg = new Admin();
        Factories::injectMock('config', Admin::class, $cfg);
        Factories::injectMock('config', 'Admin', $cfg);
    }

    protected function tearDown(): void
    {
        putenv('admin.username');
        putenv('admin.passwordHash');
        unset($_ENV['admin.username'], $_ENV['admin.passwordHash']);
        parent::tearDown();
    }

    public function test_login_page_links_admin_css_and_hides_nav(): void
    {
        $result = $this->get('/admin/login');
        $result->assertOK();
        $result->assertSee('css/admin.css');
        $result->assertSee('MetaOptics Admin');
        $result->assertSee('page-guide');
        $result->assertDontSee('Sync history');
    }

    public function test_dashboard_shows_nav_and_css(): void
    {
        $result = $this->withSession(['admin' => true])->get('/admin');
        $result->assertOK();
        $result->assertSee('css/admin.css');
        $result->assertSee('MetaOptics Admin');
        $result->assertSee('Announcements');
        $result->assertSee('Subscribers');
        $result->assertSee('Sync history');
        $result->assertSee('Settings');
        $result->assertSee('Logout');
        $result->assertSee('Quick start');
        $result->assertSee('page-guide');
    }

    public function test_dashboard_stat_cards_link_to_filtered_lists(): void
    {
        $result = $this->withSession(['admin' => true])->get('/admin');
        $result->assertOK();
        $body = $result->getBody();
        $this->assertStringContainsString('admin/announcements?state=pending_review', $body);
        $this->assertStringContainsString('admin/announcements?state=published', $body);
        $this->assertStringContainsString('admin/announcements?needs_review=1', $body);
        $this->assertStringContainsString('admin/email-alerts?status=draft', $body);
        $this->assertStringContainsString('admin/subscribers?status=active', $body);
    }
}
