<?php
declare(strict_types=1);

namespace Tests\Unit\Email;

use App\Libraries\Email\CategoryCatalog;
use CodeIgniter\Test\CIUnitTestCase;
use InvalidArgumentException;

final class CategoryCatalogTest extends CIUnitTestCase
{
    private string $tmpPath = '';

    protected function setUp(): void
    {
        parent::setUp();
        $this->tmpPath = sys_get_temp_dir() . '/mot-custom-cats-' . uniqid('', true) . '.json';
        CategoryCatalog::setCustomPathForTests($this->tmpPath);
    }

    protected function tearDown(): void
    {
        CategoryCatalog::setCustomPathForTests(null);
        if ($this->tmpPath !== '' && is_file($this->tmpPath)) {
            @unlink($this->tmpPath);
        }
        parent::tearDown();
    }

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

    public function test_remember_persists_custom_and_assert_valid_accepts_it(): void
    {
        CategoryCatalog::remember('SGX New Category');
        $this->assertContains('SGX New Category', CategoryCatalog::all());
        CategoryCatalog::assertValid(['SGX New Category']);
        $this->addToAssertionCount(1);
    }

    public function test_remember_ignores_builtins(): void
    {
        CategoryCatalog::remember('Placements');
        $this->assertFalse(is_file($this->tmpPath));
        $this->assertSame(CategoryCatalog::builtins(), CategoryCatalog::all());
    }
}
