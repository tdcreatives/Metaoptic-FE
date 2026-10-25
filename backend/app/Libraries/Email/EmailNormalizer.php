<?php
declare(strict_types=1);

namespace App\Libraries\Email;

use InvalidArgumentException;

final class EmailNormalizer
{
    public function normalize(string $email): string
    {
        $normalized = strtolower(trim($email));
        if (filter_var($normalized, FILTER_VALIDATE_EMAIL) === false) {
            throw new InvalidArgumentException('Invalid email');
        }

        return $normalized;
    }
}
