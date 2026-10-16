<?php
declare(strict_types=1);

namespace Tests\Unit\Quote;

use App\Libraries\Email\LogMailer;
use App\Libraries\Email\MailerInterface;
use App\Libraries\Email\UnsubscribeToken;
use App\Libraries\Quote\MotQuote;
use App\Libraries\Quote\MotQuoteClient;
use App\Libraries\Quote\MotQuoteFetchException;
use App\Libraries\Quote\MotQuoteFormatter;
use App\Libraries\Quote\QuoteDigestAudience;
use App\Libraries\Quote\QuoteDigestOpsNotifier;
use App\Libraries\Quote\QuoteDigestService;
use App\Libraries\Quote\TradingDayGate;
use App\Models\AdminRecipientModel;
use App\Models\QuoteDigestRunModel;
use App\Models\SubscriberCategoryModel;
use App\Models\SubscriberModel;
use CodeIgniter\Test\CIUnitTestCase;
use CodeIgniter\Test\DatabaseTestTrait;
use Config\EmailAlerts;
use Config\Services;

final class QuoteDigestServiceTest extends CIUnitTestCase
{
    use DatabaseTestTrait;

    protected $migrate = true;
    protected $refresh = true;
    protected $namespace = 'App';

    private const SECRET = 'unit-test-secret-min-32-chars-long!!';
    private const SITE = 'https://metaoptics.test';

    private string $mailLogPath;

    protected function setUp(): void
    {
        parent::setUp();
        $cfg = config(EmailAlerts::class);
        $cfg->unsubscribeSecret = self::SECRET;
        $cfg->publicSiteUrl = self::SITE;

        $this->mailLogPath = WRITEPATH . 'logs/mail-quote-digest-' . bin2hex(random_bytes(4)) . '.log';
        Services::injectMock('mailer', new LogMailer($this->mailLogPath));
    }

    protected function tearDown(): void
    {
        if (is_file($this->mailLogPath)) {
            unlink($this->mailLogPath);
        }
        Services::reset(true);
        parent::tearDown();
    }

    public function test_weekend_skips_with_no_mail(): void
    {
        $sat = new \DateTimeImmutable('2026-10-17 16:00:00', new \DateTimeZone('Asia/Singapore'));

        $out = $this->service()->run($sat);

        $this->assertSame('skipped_non_trading_day', $out['status']);
        $this->assertFileDoesNotExist($this->mailLogPath);
        $row = (new QuoteDigestRunModel())->where('digest_date', '2026-10-17')->first();
        $this->assertSame('skipped_non_trading_day', $row['status']);
        $this->assertSame(0, (int) $row['attempt_count']);
    }

    public function test_weekday_sends_digest_to_subscriber(): void
    {
        $this->insertSubscriber('digest@example.com', 'active', [QuoteDigestAudience::CATEGORY]);
        $quote = $this->sampleQuote();
        $formatter = new MotQuoteFormatter();
        $asOf = '4:00pm SGT';
        $expectedSubject = $formatter->subject($quote, $asOf);
        $fri = new \DateTimeImmutable('2026-10-16 16:00:00', new \DateTimeZone('Asia/Singapore'));

        $out = $this->service(client: $this->clientReturning($quote))->run($fri);

        $this->assertSame('success', $out['status']);
        $this->assertFileExists($this->mailLogPath);
        $lines = $this->mailLogLines();
        $this->assertCount(1, $lines);
        $this->assertSame('digest@example.com', $lines[0]['to']);
        $this->assertSame($expectedSubject, $lines[0]['subject']);
    }

    public function test_weekday_no_subscribers_skips_without_ops_alert(): void
    {
        (new AdminRecipientModel())->insert(['email' => 'ops@example.com', 'active' => 1]);
        $fri = new \DateTimeImmutable('2026-10-16 16:00:00', new \DateTimeZone('Asia/Singapore'));

        $out = $this->service(client: $this->clientReturning($this->sampleQuote()))->run($fri);

        $this->assertSame('skipped_no_recipients', $out['status']);
        $this->assertNoOpsFailureMail();
    }

    public function test_third_failed_attempt_triggers_ops_alert(): void
    {
        (new AdminRecipientModel())->insert(['email' => 'ops@example.com', 'active' => 1]);
        $fri = new \DateTimeImmutable('2026-10-16 16:00:00', new \DateTimeZone('Asia/Singapore'));
        $client = new MotQuoteClient(static function (): string {
            throw new MotQuoteFetchException('SGX fetch timed out');
        });
        $svc = $this->service(client: $client);

        $this->assertSame('failed', $svc->run($fri)['status']);
        $this->assertSame('failed', $svc->run($fri)['status']);
        $this->assertSame('failed', $svc->run($fri)['status']);

        $lines = $this->mailLogLines();
        $ops = array_values(array_filter(
            $lines,
            static fn (array $row): bool => str_contains((string) $row['subject'], 'Daily 9MT digest failed'),
        ));
        $this->assertCount(1, $ops);
        $this->assertSame('ops@example.com', $ops[0]['to']);
    }

    public function test_success_same_day_second_run_is_noop(): void
    {
        $this->insertSubscriber('digest@example.com', 'active', [QuoteDigestAudience::CATEGORY]);
        $fri = new \DateTimeImmutable('2026-10-16 16:00:00', new \DateTimeZone('Asia/Singapore'));
        $svc = $this->service(client: $this->clientReturning($this->sampleQuote()));

        $this->assertSame('success', $svc->run($fri)['status']);
        $this->assertCount(1, $this->mailLogLines());

        $noop = $svc->run($fri);
        $this->assertSame('success', $noop['status']);
        $this->assertCount(1, $this->mailLogLines());
    }

    private function service(?MotQuoteClient $client = null): QuoteDigestService
    {
        return new QuoteDigestService(
            gate: new TradingDayGate(),
            client: $client ?? $this->clientReturning($this->sampleQuote()),
            formatter: new MotQuoteFormatter(),
            audience: new QuoteDigestAudience(),
            opsNotifier: new QuoteDigestOpsNotifier(),
            tokens: new UnsubscribeToken(self::SECRET),
            mailer: Services::mailer(),
            runs: new QuoteDigestRunModel(),
        );
    }

    private function sampleQuote(): MotQuote
    {
        return new MotQuote('9MT', 0.310, 0.305, 0.305, 0.315, 0.305, 86.8, 26800.0, '2026-10-16T16:00:00');
    }

    private function clientReturning(MotQuote $quote): MotQuoteClient
    {
        return new MotQuoteClient(static function () use ($quote): string {
            return json_encode([
                'data' => [[
                    'nc' => $quote->code,
                    'lt' => $quote->last,
                    'o' => $quote->open,
                    'h' => $quote->high,
                    'l' => $quote->low,
                    'pv' => $quote->priorClose,
                    'c' => $quote->last,
                    'vl' => $quote->volumeThousands,
                    'v' => $quote->valueSgd,
                    'trading_time' => $quote->tradingTime,
                ]],
            ], JSON_THROW_ON_ERROR);
        });
    }

    /** @param list<string> $categories */
    private function insertSubscriber(string $email, string $status, array $categories): void
    {
        $id = (int) (new SubscriberModel())->insert([
            'email' => $email,
            'first_name' => 'A',
            'last_name' => 'B',
            'status' => $status,
            'consented_at' => '2026-01-01 00:00:00',
            'unsubscribed_at' => $status === 'unsubscribed' ? '2026-02-01 00:00:00' : null,
        ], true);
        foreach ($categories as $key) {
            (new SubscriberCategoryModel())->insert([
                'subscriber_id' => $id,
                'category_key' => $key,
            ]);
        }
    }

    /** @return list<array<string, mixed>> */
    private function mailLogLines(): array
    {
        if (! is_file($this->mailLogPath)) {
            return [];
        }
        $lines = [];
        foreach (file($this->mailLogPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
            $row = json_decode($line, true);
            if (is_array($row)) {
                $lines[] = $row;
            }
        }

        return $lines;
    }

    private function assertNoOpsFailureMail(): void
    {
        foreach ($this->mailLogLines() as $row) {
            $this->assertStringNotContainsString(
                'Daily 9MT digest failed',
                (string) ($row['subject'] ?? ''),
            );
        }
    }
}
