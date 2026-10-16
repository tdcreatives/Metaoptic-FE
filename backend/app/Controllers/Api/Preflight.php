<?php
declare(strict_types=1);

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Libraries\Http\CorsHeaders;
use CodeIgniter\HTTP\ResponseInterface;

class Preflight extends BaseController
{
    public function options(): ResponseInterface
    {
        return CorsHeaders::preflight($this->request, $this->response);
    }
}
