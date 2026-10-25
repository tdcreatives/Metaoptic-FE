<?php
declare(strict_types=1);

namespace App\Libraries\Http;

use CodeIgniter\HTTP\IncomingRequest;
use CodeIgniter\HTTP\ResponseInterface;

final class CorsHeaders
{
    public static function apply(IncomingRequest $request, ResponseInterface $response): void
    {
        $origin = $request->getHeaderLine('Origin');
        $response->removeHeader('Access-Control-Allow-Origin');
        if ($origin !== '' && self::isAllowedOrigin($origin)) {
            $response->setHeader('Access-Control-Allow-Origin', $origin);
        }
        $response->setHeader('Vary', 'Origin');
    }

    public static function preflight(IncomingRequest $request, ResponseInterface $response): ResponseInterface
    {
        self::apply($request, $response);
        // GET for announcements; POST for contact/subscribe/unsubscribe
        $response->setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        $response->setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');

        return $response->setStatusCode(204);
    }

    public static function isAllowedOrigin(string $origin): bool
    {
        $cfg = config('Sgx');
        if (in_array($origin, $cfg->corsOrigins, true)) {
            return true;
        }

        foreach ($cfg->corsOriginPatterns as $pattern) {
            if ($pattern !== '' && preg_match(self::patternToRegex($pattern), $origin) === 1) {
                return true;
            }
        }

        return false;
    }

    /** Convert simple wildcard origin (e.g. https://*.pages.dev) to a full-match regex. */
    private static function patternToRegex(string $pattern): string
    {
        $parts = preg_split('/(\*)/', $pattern, -1, PREG_SPLIT_DELIM_CAPTURE) ?: [];
        $regex = '';
        foreach ($parts as $part) {
            $regex .= $part === '*' ? '.*' : preg_quote($part, '/');
        }

        return '/^' . $regex . '$/i';
    }
}
