<?php
declare(strict_types=1);

namespace App\Libraries\Sgx;

final class LayoutTitleDeriver
{
    public static function bannerFromCategory(string $category): string
    {
        $upper = strtoupper(trim($category));
        $pos = strpos($upper, ' ');
        if ($pos === false) {
            return $upper;
        }

        return substr($upper, 0, $pos) . '<br/>' . substr($upper, $pos + 1);
    }

    public static function btnFromTitle(string $title): string
    {
        return $title;
    }
}
