<?php
declare(strict_types=1);

namespace App\Libraries\Email;

final class AlertBodyRenderer
{
    /**
     * @param list<array{title: string, filed_at: string, url: string}> $items
     */
    public function render(string $bodyHtml, string $intro, array $items): string
    {
        $listHtml = $this->listHtml($items);
        $token = '{{announcement}}';
        if (str_contains($bodyHtml, $token)) {
            $bodyHtml = str_replace($token, $listHtml, $bodyHtml);
        } else {
            $bodyHtml .= $listHtml;
        }
        $introBlock = $intro !== '' ? '<p>' . esc($intro) . '</p>' : '';

        return $introBlock . $bodyHtml;
    }

    /**
     * @param list<array{title: string, filed_at: string, url: string}> $items
     */
    private function listHtml(array $items): string
    {
        $lis = '';
        foreach ($items as $item) {
            $title = esc((string) ($item['title'] ?? ''));
            $filedAt = esc((string) ($item['filed_at'] ?? ''));
            $url = esc((string) ($item['url'] ?? ''), 'url');
            $lis .= '<li><a href="' . $url . '">' . $title . '</a> (' . $filedAt . ')</li>';
        }

        return '<ul>' . $lis . '</ul>';
    }
}
