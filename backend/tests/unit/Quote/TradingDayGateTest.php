<?php
declare(strict_types=1);

namespace Tests\Unit\Quote;

use App\Libraries\Quote\TradingDayGate;
use CodeIgniter\Test\CIUnitTestCase;

final class TradingDayGateTest extends CIUnitTestCase
{
    public function test_weekday_true_weekend_false(): void
    {
        $gate = new TradingDayGate();
        $fri = new \DateTimeImmutable('2026-10-16 16:00:00', new \DateTimeZone('Asia/Singapore')); // Friday
        $sat = new \DateTimeImmutable('2026-10-17 16:00:00', new \DateTimeZone('Asia/Singapore'));
        $this->assertTrue($gate->isTradingDay($fri));
        $this->assertFalse($gate->isTradingDay($sat));
    }
}
