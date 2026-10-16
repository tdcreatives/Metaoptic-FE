<?php
declare(strict_types=1);

namespace Tests\Unit\Quote;

use App\Libraries\Quote\MotQuote;
use App\Libraries\Quote\MotQuoteFormatter;
use CodeIgniter\Test\CIUnitTestCase;

final class MotQuoteDigestViewTest extends CIUnitTestCase
{
    public function test_mot_quote_digest_renders_session_pack(): void
    {
        $quote = new MotQuote('9MT', 0.310, 0.305, 0.305, 0.315, 0.305, 86.8, 26800.0, '2026-10-16T12:06:00');
        $formatter = new MotQuoteFormatter();
        $unsubscribeUrl = 'https://example.test/unsub';

        $html = view('emails/mot_quote_digest', [
            'quote' => $quote,
            'priceLabel' => 'S$' . $formatter->formatPrice($quote->last),
            'changeLabel' => $formatter->changeLabel($quote),
            'asOfLabel' => '4:00pm SGT',
            'open' => $formatter->formatPrice($quote->open),
            'high' => $formatter->formatPrice($quote->high),
            'low' => $formatter->formatPrice($quote->low),
            'volumeSharesLabel' => number_format($formatter->volumeShares($quote)),
            'valueLabel' => number_format($quote->valueSgd, 2, '.', ','),
            'sgxUrl' => 'https://investors.sgx.com/market/securities?code=9MT&type=stocks&lang=en',
            'unsubscribeUrl' => $unsubscribeUrl,
            'preheader' => 'Open, high, low, volume for today’s session · Not investment advice',
        ]);

        $this->assertStringContainsString('0.310', $html);
        $this->assertTrue(
            str_contains($html, '86,800') || str_contains($html, '86800'),
            'Expected formatted or raw volume shares in HTML',
        );
        $this->assertStringContainsString('9MT', $html);
        $this->assertStringContainsString('Intraday', $html);
        $this->assertStringContainsString($unsubscribeUrl, $html);
        $this->assertStringNotContainsString('closing price', strtolower($html));
        $this->assertStringContainsString('Daily stock update', $html);
    }
}
