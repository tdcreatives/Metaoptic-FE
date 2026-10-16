<?php
declare(strict_types=1);

namespace App\Libraries\Quote;

final class MotQuoteFormatter
{
    public function changeAbs(MotQuote $q): float
    {
        return $q->last - $q->priorClose;
    }

    public function changePct(MotQuote $q): float
    {
        if ($q->priorClose == 0.0) {
            return 0.0;
        }

        return ($this->changeAbs($q) / $q->priorClose) * 100.0;
    }

    public function volumeShares(MotQuote $q): int
    {
        return (int) round($q->volumeThousands * 1000);
    }

    public function formatPrice(float $p): string
    {
        return number_format($p, 3, '.', '');
    }

    public function subject(MotQuote $q, string $asOfLabel): string
    {
        $price = $this->formatPrice($q->last);
        $change = $this->changeLabel($q);

        return sprintf(
            'MetaOptics (%s) — S$%s (%s) as of %s',
            $q->code,
            $price,
            $change,
            $asOfLabel,
        );
    }

    public function changeLabel(MotQuote $q): string
    {
        $abs = $this->changeAbs($q);
        if ($abs == 0.0) {
            return 'unchanged';
        }

        $pct = $this->changePct($q);
        $absPrefix = $abs > 0 ? '+' : '-';
        $pctPrefix = $pct > 0 ? '+' : '';

        return sprintf(
            '%s%s (%s%.1f%%)',
            $absPrefix,
            $this->formatPrice(abs($abs)),
            $pctPrefix,
            $pct,
        );
    }
}
