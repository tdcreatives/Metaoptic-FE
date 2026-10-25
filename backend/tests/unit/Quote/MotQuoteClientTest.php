<?php
declare(strict_types=1);

namespace Tests\Unit\Quote;

use App\Libraries\Quote\MotQuoteClient;
use App\Libraries\Quote\MotQuoteFetchException;
use CodeIgniter\Test\CIUnitTestCase;

final class MotQuoteClientTest extends CIUnitTestCase
{
    /** @return array<string, mixed> */
    private static function row9mt(): array
    {
        return [
            'nc' => '9MT',
            'lt' => 0.310,
            'pv' => 0.305,
            'o' => 0.305,
            'h' => 0.315,
            'l' => 0.305,
            'vl' => 86.8,
            'v' => 26800,
            'trading_time' => '20261016_054100',
        ];
    }

    /** @param list<array<string, mixed>> $prices */
    private static function envelope(array $prices): string
    {
        return json_encode([
            'meta' => ['code' => '200', 'message' => 'success'],
            'data' => ['prices' => $prices],
        ], JSON_THROW_ON_ERROR);
    }

    public function test_parses_9mt_row(): void
    {
        $json = self::envelope([self::row9mt(), ['nc' => 'OTHER', 'lt' => 1, 'pv' => 1]]);
        $client = new MotQuoteClient(static fn () => $json);
        $q = $client->fetch9mt();
        $this->assertSame('9MT', $q->code);
        $this->assertEqualsWithDelta(0.310, $q->last, 1e-9);
        $this->assertEqualsWithDelta(0.305, $q->priorClose, 1e-9);
        $this->assertEqualsWithDelta(86.8, $q->volumeThousands, 1e-9);
        $this->assertSame('20261016_054100', $q->tradingTime);
    }

    public function test_missing_9mt_throws(): void
    {
        $this->expectException(MotQuoteFetchException::class);
        (new MotQuoteClient(static fn () => self::envelope([['nc' => 'OTHER', 'lt' => 1, 'pv' => 1]])))->fetch9mt();
    }

    public function test_accepts_top_level_list(): void
    {
        $json = json_encode([self::row9mt()], JSON_THROW_ON_ERROR);
        $q = (new MotQuoteClient(static fn () => $json))->fetch9mt();
        $this->assertSame('9MT', $q->code);
    }

    public function test_accepts_data_as_list(): void
    {
        $json = json_encode(['data' => [self::row9mt()]], JSON_THROW_ON_ERROR);
        $q = (new MotQuoteClient(static fn () => $json))->fetch9mt();
        $this->assertSame('9MT', $q->code);
    }

    public function test_non_numeric_lt_throws(): void
    {
        $row = self::row9mt();
        $row['lt'] = 'n/a';
        $this->expectException(MotQuoteFetchException::class);
        (new MotQuoteClient(static fn () => self::envelope([$row])))->fetch9mt();
    }

    public function test_zero_lt_throws(): void
    {
        $row = self::row9mt();
        $row['lt'] = 0;
        $this->expectException(MotQuoteFetchException::class);
        (new MotQuoteClient(static fn () => self::envelope([$row])))->fetch9mt();
    }

    public function test_zero_pv_throws(): void
    {
        $row = self::row9mt();
        $row['pv'] = 0;
        $this->expectException(MotQuoteFetchException::class);
        (new MotQuoteClient(static fn () => self::envelope([$row])))->fetch9mt();
    }
}
