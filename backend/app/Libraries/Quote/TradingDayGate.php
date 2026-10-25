<?php
declare(strict_types=1);

namespace App\Libraries\Quote;

final class TradingDayGate
{
    private const SGT = 'Asia/Singapore';

    public function isTradingDay(\DateTimeImmutable $now): bool
    {
        $sgt = $now->setTimezone(new \DateTimeZone(self::SGT));
        $dow = (int) $sgt->format('N');

        return $dow >= 1 && $dow <= 5;
    }
}
