<?php
declare(strict_types=1);

namespace App\Libraries\Quote;

use App\Libraries\Email\MailerInterface;
use App\Libraries\Email\MailMessage;
use App\Libraries\Email\UnsubscribeToken;
use App\Models\QuoteDigestRunModel;
use Config\EmailAlerts;

final class QuoteDigestService
{
    private const TZ = 'Asia/Singapore';
    private const SGX_URL = 'https://investors.sgx.com/market/securities?code=9MT&type=stocks&lang=en';

    public function __construct(
        private readonly TradingDayGate $gate = new TradingDayGate(),
        private readonly MotQuoteClient $client = new MotQuoteClient(),
        private readonly MotQuoteFormatter $formatter = new MotQuoteFormatter(),
        private readonly QuoteDigestAudience $audience = new QuoteDigestAudience(),
        private readonly QuoteDigestOpsNotifier $opsNotifier = new QuoteDigestOpsNotifier(),
        private readonly ?UnsubscribeToken $tokens = null,
        private readonly ?MailerInterface $mailer = null,
        private readonly ?QuoteDigestRunModel $runs = null,
    ) {
    }

    /** @return array{status:string,run_id:?int,message:string} */
    public function run(?\DateTimeImmutable $now = null): array
    {
        $tz = new \DateTimeZone(self::TZ);
        $now = ($now ?? new \DateTimeImmutable('now', $tz))->setTimezone($tz);
        $date = $now->format('Y-m-d');
        $nowStr = $now->format('Y-m-d H:i:s');

        $runs = $this->runs ?? new QuoteDigestRunModel();
        $existing = $runs->where('digest_date', $date)->first();

        if ($existing !== null && in_array($existing['status'], [
            'success',
            'skipped_non_trading_day',
            'skipped_no_recipients',
        ], true)) {
            return $this->result(
                (string) $existing['status'],
                (int) $existing['id'],
                'Already completed for ' . $date,
            );
        }

        if (! $this->gate->isTradingDay($now)) {
            $runId = $this->upsertTerminal($runs, $existing, $date, $nowStr, [
                'status' => 'skipped_non_trading_day',
                'attempt_count' => 0,
            ]);

            return $this->result('skipped_non_trading_day', $runId, 'Not a trading day');
        }

        $attempt = $existing !== null ? (int) $existing['attempt_count'] + 1 : 1;
        if ($attempt > 3) {
            return $this->result(
                (string) ($existing['status'] ?? 'failed'),
                $existing !== null ? (int) $existing['id'] : null,
                'Max attempts reached',
            );
        }

        $runId = $this->markRunning($runs, $existing, $date, $attempt, $nowStr);

        try {
            $quote = $this->client->fetch9mt();
            $subs = $this->audience->activePressReleaseSubscribers();
            $snapshot = $this->quoteSnapshot($quote);

            if ($subs === []) {
                $this->finishRun($runs, $runId, array_merge($snapshot, [
                    'status' => 'skipped_no_recipients',
                    'finished_at' => $nowStr,
                ]));

                return $this->result('skipped_no_recipients', $runId, 'No recipients');
            }

            $sent = 0;
            $failed = 0;
            $asOfLabel = $this->asOfLabel($quote, $now);
            $subject = $this->formatter->subject($quote, $asOfLabel);
            $mailer = $this->mailer ?? \Config\Services::mailer();
            $tokens = $this->tokens ?? new UnsubscribeToken((string) config(EmailAlerts::class)->unsubscribeSecret);

            foreach ($subs as $sub) {
                try {
                    $unsub = $tokens->pageUrl($tokens->forSubscriber((int) $sub['id']));
                    $html = view('emails/mot_quote_digest', $this->viewVars($quote, $asOfLabel, $unsub));
                    $text = $subject . "\n\nUnsubscribe: " . $unsub;
                    $mailer->send(new MailMessage((string) $sub['email'], $subject, $text, $html));
                    $sent++;
                } catch (\Throwable) {
                    $failed++;
                }
            }

            if ($sent === 0) {
                throw new \RuntimeException(
                    sprintf('All digest sends failed (%d recipients)', count($subs)),
                );
            }

            $this->finishRun($runs, $runId, array_merge($snapshot, [
                'status' => 'success',
                'recipient_count' => count($subs),
                'sent_count' => $sent,
                'failed_count' => $failed,
                'finished_at' => $nowStr,
            ]));

            return $this->result('success', $runId, sprintf('Sent to %d recipients', count($subs)));
        } catch (\Throwable $e) {
            $message = substr($e->getMessage(), 0, 1000);
            $this->finishRun($runs, $runId, [
                'status' => 'failed',
                'error_message' => $message,
                'finished_at' => $nowStr,
            ]);

            if ($attempt >= 3) {
                $this->opsNotifier->notifyFailure($date, $message, $runId);
            }

            return $this->result('failed', $runId, $message);
        }
    }

    /** @param array<string, mixed> $fields */
    private function markRunning(
        QuoteDigestRunModel $runs,
        ?array $existing,
        string $date,
        int $attempt,
        string $nowStr,
    ): int {
        if ($existing !== null) {
            $runs->update((int) $existing['id'], [
                'status' => 'running',
                'attempt_count' => $attempt,
                'finished_at' => null,
                'error_message' => null,
            ]);

            return (int) $existing['id'];
        }

        return (int) $runs->insert([
            'digest_date' => $date,
            'status' => 'running',
            'attempt_count' => $attempt,
            'started_at' => $nowStr,
            'finished_at' => null,
        ], true);
    }

    /** @param array<string, mixed> $fields */
    private function upsertTerminal(
        QuoteDigestRunModel $runs,
        ?array $existing,
        string $date,
        string $nowStr,
        array $fields,
    ): int {
        $fields['finished_at'] = $nowStr;
        if ($existing !== null) {
            $runs->update((int) $existing['id'], $fields);

            return (int) $existing['id'];
        }

        return (int) $runs->insert(array_merge([
            'digest_date' => $date,
            'started_at' => $nowStr,
        ], $fields), true);
    }

    /** @param array<string, mixed> $fields */
    private function finishRun(QuoteDigestRunModel $runs, int $runId, array $fields): void
    {
        $runs->update($runId, $fields);
    }

    /** @return array{status:string,run_id:?int,message:string} */
    private function result(string $status, ?int $runId, string $message): array
    {
        return ['status' => $status, 'run_id' => $runId, 'message' => $message];
    }

    /** @return array<string, mixed> */
    private function quoteSnapshot(MotQuote $quote): array
    {
        return [
            'last_price' => $quote->last,
            'change_abs' => $this->formatter->changeAbs($quote),
            'change_pct' => $this->formatter->changePct($quote),
            'quote_json' => json_encode([
                'code' => $quote->code,
                'last' => $quote->last,
                'priorClose' => $quote->priorClose,
                'open' => $quote->open,
                'high' => $quote->high,
                'low' => $quote->low,
                'volumeThousands' => $quote->volumeThousands,
                'valueSgd' => $quote->valueSgd,
                'tradingTime' => $quote->tradingTime,
            ], JSON_UNESCAPED_UNICODE),
        ];
    }

    private function asOfLabel(MotQuote $quote, \DateTimeImmutable $now): string
    {
        if ($quote->tradingTime !== null && $quote->tradingTime !== '') {
            $tz = new \DateTimeZone(self::TZ);
            $dt = \DateTimeImmutable::createFromFormat('Ymd_His', $quote->tradingTime, $tz);
            if ($dt !== false) {
                return $dt->format('g:ia') . ' SGT';
            }
        }

        return $now->format('g:ia') . ' SGT';
    }

    /** @return array<string, mixed> */
    private function viewVars(MotQuote $quote, string $asOfLabel, string $unsubscribeUrl): array
    {
        return [
            'priceLabel' => 'S$' . $this->formatter->formatPrice($quote->last),
            'changeLabel' => $this->formatter->changeLabel($quote),
            'asOfLabel' => $asOfLabel,
            'open' => $this->formatter->formatPrice($quote->open),
            'high' => $this->formatter->formatPrice($quote->high),
            'low' => $this->formatter->formatPrice($quote->low),
            'volumeSharesLabel' => number_format($this->formatter->volumeShares($quote)),
            'valueLabel' => number_format($quote->valueSgd, 2, '.', ','),
            'sgxUrl' => self::SGX_URL,
            'unsubscribeUrl' => $unsubscribeUrl,
            'preheader' => 'Open, high, low, volume for today’s session · Not investment advice',
        ];
    }
}
