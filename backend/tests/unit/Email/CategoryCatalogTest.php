<?php
declare(strict_types=1);

namespace Tests\Unit\Email;

use App\Libraries\Email\CategoryCatalog;
use CodeIgniter\Test\CIUnitTestCase;
use InvalidArgumentException;

final class CategoryCatalogTest extends CIUnitTestCase
{
    public function test_all_matches_frontend_announcement_categories(): void
    {
        $this->assertSame([
            'General Announcement',
            'Disclosure of Interest',
            'Placements',
            'Personnel Changes',
            'Annual Reports',
            'AGM / EGM',
            'Equity & Listing',
            'Financial Statements',
        ], CategoryCatalog::all());
    }

    public function test_assert_valid_accepts_known_keys(): void
    {
        CategoryCatalog::assertValid(['Placements', 'Annual Reports']);
        $this->addToAssertionCount(1);
    }

    public function test_assert_valid_rejects_unknown_key(): void
    {
        $this->expectException(InvalidArgumentException::class);
        CategoryCatalog::assertValid(['General Announcement', 'Not A Category']);
    }
}
