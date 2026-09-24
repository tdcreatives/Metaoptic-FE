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

    /** @return list<string> */
    public static function all(): array
    {
        return self::KEYS;
    }

    /** @param list<string> $keys */
    public static function assertValid(array $keys): void
    {
        $allowed = array_flip(self::KEYS);
        foreach ($keys as $key) {
            if (! isset($allowed[$key])) {
                throw new InvalidArgumentException('Invalid category: ' . $key);
            }
        }
    }
}
