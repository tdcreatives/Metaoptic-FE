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
        if ($origin !== '' && in_array($origin, config('Sgx')->corsOrigins, true)) {
            $response->setHeader('Access-Control-Allow-Origin', $origin);
        }
        $response->setHeader('Vary', 'Origin');
    }

    public static function preflight(IncomingRequest $request, ResponseInterface $response): ResponseInterface
    {
        self::apply($request, $response);
        $response->setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
        $response->setHeader('Access-Control-Allow-Headers', 'Content-Type');

        return $response->setStatusCode(204);
    }
}
