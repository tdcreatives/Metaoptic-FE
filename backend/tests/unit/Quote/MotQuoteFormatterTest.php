<?php
declare(strict_types=1);

namespace Tests\Unit\Quote;

use App\Libraries\Quote\MotQuote;
use App\Libraries\Quote\MotQuoteFormatter;
use CodeIgniter\Test\CIUnitTestCase;

final class MotQuoteFormatterTest extends CIUnitTestCase
{
    public function test_volume_and_change(): void
    {
        $q = new MotQuote('9MT', 0.310, 0.305, 0.305, 0.315, 0.305, 86.8, 26800.0, '2026-10-16T12:06:00');
        $f = new MotQuoteFormatter();
        $this->assertSame(86800, $f->volumeShares($q));
        $this->assertEqualsWithDelta(0.005, $f->changeAbs($q), 1e-9);
        $this->assertEqualsWithDelta(1.639344262, $f->changePct($q), 1e-6);
        $this->assertStringContainsString('0.310', $f->subject($q, '4:00pm SGT'));
        $this->assertStringContainsString('+', $f->changeLabel($q));
    }

    public function test_unchanged_label(): void
    {
        $q = new MotQuote('9MT', 0.305, 0.305, 0.305, 0.305, 0.305, 0.0, 0.0, null);
        $this->assertSame('unchanged', (new MotQuoteFormatter())->changeLabel($q));
    }
}
