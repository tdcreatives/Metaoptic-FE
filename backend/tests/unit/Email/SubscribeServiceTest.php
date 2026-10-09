<?php
declare(strict_types=1);

namespace Tests\Unit\Email;

use App\Libraries\Email\MailerInterface;
use App\Libraries\Email\MailMessage;
use App\Libraries\Email\SubscribeService;
use App\Libraries\Email\UnsubscribeToken;
use App\Models\SubscriberCategoryModel;
use App\Models\SubscriberModel;
use CodeIgniter\Config\Factories;
use CodeIgniter\Test\CIUnitTestCase;
use CodeIgniter\Test\DatabaseTestTrait;
use Config\EmailAlerts;

final class SubscribeServiceTest extends CIUnitTestCase
{
    use DatabaseTestTrait;

    protected $migrate = true;
    protected $refresh = true;
    protected $namespace = 'App';

    private const SECRET = 'unit-test-secret-min-32-chars-long!!';

    protected function setUp(): void
    {
        parent::setUp();
        $_ENV['email.unsubscribeSecret'] = self::SECRET;
        $_ENV['email.publicSiteURL'] = 'https://metaoptics.sg';
        putenv('email.unsubscribeSecret=' . self::SECRET);
        putenv('email.publicSiteURL=https://metaoptics.sg');
        $cfg = new EmailAlerts();
        Factories::injectMock('config', EmailAlerts::class, $cfg);
        Factories::injectMock('config', 'EmailAlerts', $cfg);
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
        parent::tearDown();
    }

    public function test_creates_active_subscriber_categories_token_and_sends_confirmation(): void
    {
        $mailer = $this->mailer();
        $tokens = new UnsubscribeToken(self::SECRET);

        $this->service($mailer, $tokens)->subscribe([
            'email' => '  IR@MetaOptics.SG  ',
            'first_name' => 'Ivy',
            'last_name' => 'R',
            'categories' => ['General Announcement', 'Financial Statements'],
            'website' => '',
        ]);

        $row = (new SubscriberModel())->where('email', 'ir@metaoptics.sg')->first();
        $this->assertNotNull($row);
        $this->assertSame('active', $row['status']);
        $this->assertSame('Ivy', $row['first_name']);
        $this->assertSame('R', $row['last_name']);
        $this->assertNotNull($row['consented_at']);
        $this->assertNull($row['unsubscribed_at']);

        $plain = $tokens->forSubscriber((int) $row['id']);
        $this->assertSame($tokens->hashPlain($plain), $row['unsubscribe_token_hash']);

        $cats = (new SubscriberCategoryModel())->where('subscriber_id', $row['id'])->findAll();
        $keys = array_column($cats, 'category_key');
        sort($keys);
        $this->assertSame(['Financial Statements', 'General Announcement'], $keys);

        $this->assertCount(1, $mailer->sent);
        $this->assertSame('ir@metaoptics.sg', $mailer->sent[0]->to);
        $this->assertSame('Confirm your MetaOptics IR alerts subscription', $mailer->sent[0]->subject);
        $this->assertStringContainsString('unsubscribe', strtolower($mailer->sent[0]->textBody));
        $this->assertStringContainsString('/investor-relations/resources/email-alerts?unsub=', $mailer->sent[0]->textBody);
        $this->assertStringContainsString($plain, $mailer->sent[0]->textBody);
    }

    public function test_honeypot_filled_is_noop(): void
    {
        $mailer = $this->mailer();
        $this->service($mailer, new UnsubscribeToken(self::SECRET))->subscribe([
            'email' => 'bot@example.com',
            'categories' => ['General Announcement'],
            'website' => 'https://spam.example',
        ]);

        $this->assertNull((new SubscriberModel())->where('email', 'bot@example.com')->first());
        $this->assertSame([], $mailer->sent);
    }

    public function test_existing_active_replaces_categories_without_second_confirmation(): void
    {
        $mailer = $this->mailer();
        $svc = $this->service($mailer, new UnsubscribeToken(self::SECRET));
        $payload = [
            'email' => 'keep@example.com',
            'categories' => ['General Announcement'],
            'website' => '',
        ];
        $svc->subscribe($payload);
        $this->assertCount(1, $mailer->sent);

        $svc->subscribe([
            'email' => 'keep@example.com',
            'categories' => ['Placements', 'AGM / EGM'],
            'website' => '',
        ]);

        $row = (new SubscriberModel())->where('email', 'keep@example.com')->first();
        $keys = array_column(
            (new SubscriberCategoryModel())->where('subscriber_id', $row['id'])->findAll(),
            'category_key'
        );
        sort($keys);
        $this->assertSame(['AGM / EGM', 'Placements'], $keys);
        $this->assertCount(1, $mailer->sent);
        $this->assertSame(1, (new SubscriberModel())->where('email', 'keep@example.com')->countAllResults());
    }

    public function test_unsubscribed_reactivates_with_new_consent_token_and_confirmation(): void
    {
        $mailer = $this->mailer();
        $tokens = new UnsubscribeToken(self::SECRET);
        $svc = $this->service($mailer, $tokens);
        $svc->subscribe([
            'email' => 'back@example.com',
            'categories' => ['General Announcement'],
            'website' => '',
        ]);
        $row = (new SubscriberModel())->where('email', 'back@example.com')->first();
        (new SubscriberModel())->update($row['id'], [
            'status' => 'unsubscribed',
            'unsubscribed_at' => '2020-01-01 00:00:00',
            'consented_at' => '2020-01-01 00:00:00',
        ]);
        $mailer->sent = [];

        $svc->subscribe([
            'email' => 'back@example.com',
            'categories' => ['Personnel Changes'],
            'website' => '',
        ]);

        $updated = (new SubscriberModel())->find($row['id']);
        $this->assertSame('active', $updated['status']);
        $this->assertNull($updated['unsubscribed_at']);
        $this->assertNotSame('2020-01-01 00:00:00', $updated['consented_at']);
        $this->assertSame(
            $tokens->hashPlain($tokens->forSubscriber((int) $row['id'])),
            $updated['unsubscribe_token_hash']
        );
        $keys = array_column(
            (new SubscriberCategoryModel())->where('subscriber_id', $row['id'])->findAll(),
            'category_key'
        );
        $this->assertSame(['Personnel Changes'], $keys);
        $this->assertCount(1, $mailer->sent);
    }

    public function test_invalid_email_or_category_is_noop(): void
    {
        $mailer = $this->mailer();
        $svc = $this->service($mailer, new UnsubscribeToken(self::SECRET));
        $svc->subscribe(['email' => 'not-an-email', 'categories' => ['General Announcement'], 'website' => '']);
        $svc->subscribe(['email' => 'ok@example.com', 'categories' => ['Not A Real Category'], 'website' => '']);

        $this->assertSame([], (new SubscriberModel())->findAll());
        $this->assertSame([], $mailer->sent);
    }

    public function test_empty_categories_is_noop(): void
    {
        $mailer = $this->mailer();
        $this->service($mailer, new UnsubscribeToken(self::SECRET))->subscribe([
            'email' => 'none@example.com',
            'categories' => [],
            'website' => '',
        ]);

        $this->assertNull((new SubscriberModel())->where('email', 'none@example.com')->first());
        $this->assertSame([], $mailer->sent);
    }

    private function service(MailerInterface $mailer, UnsubscribeToken $tokens): SubscribeService
    {
        return new SubscribeService($mailer, $tokens);
    }

    private function mailer(): MailerInterface
    {
        return new class implements MailerInterface {
            /** @var list<MailMessage> */
            public array $sent = [];

            public function send(MailMessage $message): string
            {
                $this->sent[] = $message;

                return 'msg-1';
            }
        };
    }
}
