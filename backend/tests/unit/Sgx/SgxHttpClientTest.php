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
        $this->assertSame('SG25010100ABCDE', $items[0]['ref_id']);
        $this->assertSame('SG25080100FGHIJ', $items[1]['ref_id']);
        $this->assertSame('SG25072000KLMNO', $items[2]['ref_id']);
    }

    public function test_malformed_json_throws(): void
    {
        $this->expectException(SgxFetchException::class);
        $this->clientForFixture('malformed.json')->fetchAllPages();
    }

    public function test_empty_items_with_total_greater_than_zero_throws(): void
    {
        $this->expectException(SgxFetchException::class);
        $this->clientForFixture('empty-ok-shape.json', 'count-5.json')->fetchAllPages();
    }

    public function test_empty_first_page_with_total_zero_throws(): void
    {
        $this->expectException(SgxFetchException::class);
        $this->clientForFixture('empty-ok-total-zero.json', 'count-0.json')->fetchAllPages();
    }

    private function clientForFixture(?string $fixedFile, string $countFile = 'count-3.json'): SgxHttpClient
    {
        $config = new Sgx();
        $config->baseURL = 'https://example.test/sgx';
        $config->companyCode = 'METAOPTICS LTD';
        $config->pageSize = 2;
        $config->appConfigURL = 'https://example.test/config/appconfig.json';

        $transport = function (string $method, string $url, array $headers) use ($fixedFile, $countFile): string {
            if (str_contains($url, 'appconfig.json')) {
                return (string) file_get_contents(SUPPORTPATH . 'Fixtures/sgx/appconfig.json');
            }
            if (str_contains($url, 'we_chat_qr_validator')) {
                return (string) file_get_contents(SUPPORTPATH . 'Fixtures/sgx/cms-token.json');
            }
            if (str_contains($url, '/company/count')) {
                return (string) file_get_contents(SUPPORTPATH . 'Fixtures/sgx/' . $countFile);
            }
            if ($fixedFile !== null) {
                return (string) file_get_contents(SUPPORTPATH . 'Fixtures/sgx/' . $fixedFile);
            }
            if (str_contains($url, 'pagestart=1')) {
                return (string) file_get_contents(SUPPORTPATH . 'Fixtures/sgx/list-page-2.json');
            }

            return (string) file_get_contents(SUPPORTPATH . 'Fixtures/sgx/list-page-1.json');
        };

        return new SgxHttpClient($config, $transport);
    }
}
