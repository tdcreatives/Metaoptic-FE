<?php
declare(strict_types=1);

namespace Tests\Unit\Email;

use CodeIgniter\Test\CIUnitTestCase;
use Config\EmailAlerts;

final class EmailAlertsConfigTest extends CIUnitTestCase
{
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
        parent::tearDown();
    }

    public function test_reads_unsubscribe_secret_and_public_site_url(): void
    {
        $_ENV['email.unsubscribeSecret'] = 'unit-test-secret-min-32-chars-long!!';
        $_ENV['email.publicSiteURL'] = 'https://metaoptics.sg/';
        putenv('email.unsubscribeSecret=unit-test-secret-min-32-chars-long!!');
        putenv('email.publicSiteURL=https://metaoptics.sg/');

        $cfg = new EmailAlerts();

        $this->assertSame('unit-test-secret-min-32-chars-long!!', $cfg->unsubscribeSecret);
        $this->assertSame('https://metaoptics.sg', $cfg->publicSiteUrl);
    }
}
