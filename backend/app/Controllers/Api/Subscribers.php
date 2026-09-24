<?php
declare(strict_types=1);

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Libraries\Email\SubscribeService;
use App\Libraries\Email\UnsubscribeToken;
use App\Libraries\Http\CorsHeaders;
use CodeIgniter\HTTP\ResponseInterface;
use Config\EmailAlerts;
use Config\Services;

class Subscribers extends BaseController
{
    public function create(): ResponseInterface
    {
        CorsHeaders::apply($this->request, $this->response);

        $throttler = service('throttler');
        $key = md5('subscribe:' . (string) $this->request->getIPAddress());
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
        } catch (\Throwable $e) {
            log_message('error', 'subscribers.create failed: ' . $e::class);
        }

        return $this->ok();
    }

    private function ok(): ResponseInterface
    {
        return $this->response->setStatusCode(200)->setJSON(['ok' => true]);
    }
}
