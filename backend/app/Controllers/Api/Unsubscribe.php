<?php
declare(strict_types=1);

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Libraries\Email\UnsubscribeService;
use App\Libraries\Email\UnsubscribeToken;
use App\Libraries\Http\CorsHeaders;
use CodeIgniter\HTTP\ResponseInterface;
use Config\EmailAlerts;

class Unsubscribe extends BaseController
{
    public function create(): ResponseInterface
    {
        CorsHeaders::apply($this->request, $this->response);

        $input = $this->request->getJSON(true);
        if (! is_array($input)) {
            $input = $this->request->getPost();
        }
        $token = is_array($input) ? (string) ($input['token'] ?? '') : '';

        $cfg = config(EmailAlerts::class);
        try {
            (new UnsubscribeService(new UnsubscribeToken((string) $cfg->unsubscribeSecret)))->unsubscribe($token);
        } catch (\Throwable $e) {
            log_message('error', 'unsubscribe.create failed: ' . $e::class);
        }

        return $this->ok();
    }

    private function ok(): ResponseInterface
    {
        return $this->response->setStatusCode(200)->setJSON(['ok' => true]);
    }
}
