<?php
declare(strict_types=1);

namespace App\Libraries\Email;

use InvalidArgumentException;

final class CategoryCatalog
{
    /** @var list<string> */
    private const KEYS = [
        'General Announcement',
        'Disclosure of Interest',
        'Placements',
        'Personnel Changes',
        'Annual Reports',
        'AGM / EGM',
        'Equity & Listing',
        'Financial Statements',
    ];

    private const CUSTOM_MARKER = '__custom__';

    /** @var string|null Test-only path override */
    private static ?string $customPathOverride = null;

    /** @return list<string> */
    public static function all(): array
    {
        $customs = self::loadCustoms();
        if ($customs === []) {
            return self::KEYS;
        }

        $merged = self::KEYS;
        foreach ($customs as $key) {
            if (! in_array($key, $merged, true)) {
                $merged[] = $key;
            }
        }

        return $merged;
    }

    /** @return list<string> */
    public static function builtins(): array
    {
        return self::KEYS;
    }

    public static function customMarker(): string
    {
        return self::CUSTOM_MARKER;
    }

    /**
     * Persist a non-builtin category so it appears in the CMS dropdown next time.
     * No-op for empty/builtin values. Ceiling: JSON file under writable/; rebuild if deleted.
     */
    public static function remember(string $key): void
    {
        $key = trim($key);
        if ($key === '' || $key === self::CUSTOM_MARKER) {
            return;
        }
        if (in_array($key, self::KEYS, true)) {
            return;
        }
        // ponytail: soft cap — CMS categories are short labels, not essays
        if (mb_strlen($key) > 80) {
            $key = mb_substr($key, 0, 80);
        }

        $customs = self::loadCustoms();
        if (in_array($key, $customs, true)) {
            return;
        }
        $customs[] = $key;
        self::saveCustoms($customs);
    }

    /** @param list<string> $keys */
    public static function assertValid(array $keys): void
    {
        $allowed = array_flip(self::all());
        foreach ($keys as $key) {
            if (! isset($allowed[$key])) {
                throw new InvalidArgumentException('Invalid category: ' . $key);
            }
        }
    }

    /** Test-only: point custom JSON at a temp file (null clears). */
    public static function setCustomPathForTests(?string $path): void
    {
        self::$customPathOverride = $path;
    }

    /** Default: WRITEPATH email/custom_categories.json */
    public static function customPath(): string
    {
        if (self::$customPathOverride !== null) {
            return self::$customPathOverride;
        }

        return rtrim(WRITEPATH, '/\\') . DIRECTORY_SEPARATOR . 'email' . DIRECTORY_SEPARATOR . 'custom_categories.json';
    }

    /** @return list<string> */
    private static function loadCustoms(): array
    {
        $path = self::customPath();
        if (! is_file($path)) {
            return [];
        }
        $raw = @file_get_contents($path);
        if ($raw === false || $raw === '') {
            return [];
        }
        $decoded = json_decode($raw, true);
        if (! is_array($decoded)) {
            return [];
        }
        $out = [];
        foreach ($decoded as $item) {
            if (! is_string($item)) {
                continue;
            }
            $item = trim($item);
            if ($item === '' || in_array($item, self::KEYS, true) || in_array($item, $out, true)) {
                continue;
            }
            $out[] = $item;
        }

        return $out;
    }

    /** @param list<string> $customs */
    private static function saveCustoms(array $customs): void
    {
        $path = self::customPath();
        $dir = dirname($path);
        if (! is_dir($dir) && ! @mkdir($dir, 0775, true) && ! is_dir($dir)) {
            return;
        }
        $json = json_encode(array_values($customs), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        if ($json === false) {
            return;
        }
        @file_put_contents($path, $json . "\n", LOCK_EX);
    }
}
