<?php
declare(strict_types=1);

namespace App\Libraries\Quote;

final readonly class MotQuote
{
    public function __construct(
        public string $code,
        public float $last,
        public float $priorClose,
        public float $open,
        public float $high,
        public float $low,
        public float $volumeThousands,
        public float $valueSgd,
        public ?string $tradingTime,
    ) {
    }
}
