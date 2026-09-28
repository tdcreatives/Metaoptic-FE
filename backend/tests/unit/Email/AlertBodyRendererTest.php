<?php
declare(strict_types=1);

namespace Tests\Unit\Email;

use App\Libraries\Email\AlertBodyRenderer;
use CodeIgniter\Test\CIUnitTestCase;

final class AlertBodyRendererTest extends CIUnitTestCase
{
    /** @var list<array{title: string, filed_at: string, url: string}> */
    private array $items = [
        [
            'title' => 'Item One',
            'filed_at' => '2026-09-28 09:00:00',
            'url' => 'https://ex.test/1',
        ],
    ];

    public function test_token_replaced_twice_if_present_twice(): void
    {
        $html = (new AlertBodyRenderer())->render(
            'A {{announcement}} B {{announcement}} C',
            '',
            $this->items,
        );

        $this->assertSame(2, substr_count($html, 'Item One'));
        $this->assertStringNotContainsString('{{announcement}}', $html);
        $this->assertStringStartsWith('A ', $html);
    }

    public function test_missing_token_appends_list_once(): void
    {
        $html = (new AlertBodyRenderer())->render(
            '<p>Hello</p>',
            'Intro text',
            $this->items,
        );

        $this->assertSame(1, substr_count($html, 'Item One'));
        $this->assertStringStartsWith('<p>Intro text</p>', $html);
        $this->assertStringContainsString('<p>Hello</p>', $html);
        $this->assertGreaterThan(
            strpos($html, '<p>Hello</p>'),
            strpos($html, 'Item One'),
        );
        $this->assertStringContainsString('href="https://ex.test/1"', $html);
    }
}
