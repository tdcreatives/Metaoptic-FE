<?php
declare(strict_types=1);

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Libraries\Email\SubscribeService;
use App\Libraries\Email\UnsubscribeToken;
use CodeIgniter\HTTP\ResponseInterface;
use Config\EmailAlerts;
use Config\Services;

class Subscribers extends BaseController
{
    public function create(): ResponseInterface
    {
        $this->applyCors();

        $throttler = service('throttler');
        $key = md5((string) $this->request->getIPAddress());
        if ($throttler->check($key, 10, HOUR) === false) {
            return $this->ok();
        }

        $input = $this->request->getJSON(true);
        if (! is_array($input)) {
            $input = $this->request->getPost();
        }

        $cfg = config(EmailAlerts::class);
        $service = new SubscribeService(
            Services::mailer(),
            new UnsubscribeToken((string) $cfg->unsubscribeSecret),
        );
        try {
            $service->subscribe(is_array($input) ? $input : []);
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
