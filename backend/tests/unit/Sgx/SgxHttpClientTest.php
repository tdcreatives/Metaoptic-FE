<?php
declare(strict_types=1);

namespace Tests\Unit\Sgx;

use App\Libraries\Sgx\SgxFetchException;
use App\Libraries\Sgx\SgxHttpClient;
use CodeIgniter\Test\CIUnitTestCase;
use Config\Sgx;

final class SgxHttpClientTest extends CIUnitTestCase
{
    public function test_fetch_all_pages_merges_items_across_two_pages(): void
    {
        $items = $this->clientForFixture(null)->fetchAllPages();

        $this->assertCount(3, $items);
        $this->assertSame('1001', $items[0]['id']);
        $this->assertSame('1002', $items[1]['id']);
        $this->assertSame('1003', $items[2]['id']);
    }

    public function test_malformed_json_throws(): void
    {
        $this->expectException(SgxFetchException::class);
        $this->clientForFixture('malformed.json')->fetchAllPages();
    }

    public function test_empty_items_with_total_greater_than_zero_throws(): void
    {
        $this->expectException(SgxFetchException::class);
        $this->clientForFixture('empty-ok-shape.json')->fetchAllPages();
    }

    public function test_empty_first_page_with_total_zero_throws(): void
    {
        $this->expectException(SgxFetchException::class);
        $this->clientForFixture('empty-ok-total-zero.json')->fetchAllPages();
    }

    private function clientForFixture(?string $fixedFile): SgxHttpClient
    {
        $config = new Sgx();
        $config->baseURL = 'https://example.test/sgx';
        $config->companyCode = 'MOT';

        $transport = function (string $method, string $url, array $headers) use ($fixedFile): string {
            if (str_contains($url, '/session')) {
                return '{"ok":true}';
            }
            if ($fixedFile !== null) {
                return (string) file_get_contents(SUPPORTPATH . 'Fixtures/sgx/' . $fixedFile);
            }
            if (str_contains($url, 'page=2')) {
                return (string) file_get_contents(SUPPORTPATH . 'Fixtures/sgx/list-page-2.json');
            }

            return (string) file_get_contents(SUPPORTPATH . 'Fixtures/sgx/list-page-1.json');
        };

        return new SgxHttpClient($config, $transport);
    }
}
