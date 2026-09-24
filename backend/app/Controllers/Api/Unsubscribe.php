<?php
declare(strict_types=1);

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Libraries\Email\UnsubscribeService;
use App\Libraries\Email\UnsubscribeToken;
use CodeIgniter\HTTP\ResponseInterface;
use Config\EmailAlerts;

class Unsubscribe extends BaseController
{
    public function create(): ResponseInterface
    {
        $this->applyCors();

        $input = $this->request->getJSON(true);
        if (! is_array($input)) {
            $input = $this->request->getPost();
        }
        $token = is_array($input) ? (string) ($input['token'] ?? '') : '';

        $cfg = config(EmailAlerts::class);
        try {
            (new UnsubscribeService(new UnsubscribeToken((string) $cfg->unsubscribeSecret)))->unsubscribe($token);
        } catch (\Throwable) {
            // always 200 {ok:true} — no enumeration
        }

        return $this->ok();
    }

    private function ok(): ResponseInterface
    {
        return $this->response->setStatusCode(200)->setJSON(['ok' => true]);
    }

    private function applyCors(): void
    {
        $origin = $this->request->getHeaderLine('Origin');
        $this->response->removeHeader('Access-Control-Allow-Origin');
        if ($origin !== '' && in_array($origin, config('Sgx')->corsOrigins, true)) {
            $this->response->setHeader('Access-Control-Allow-Origin', $origin);
        }
    }
}
