<?php
declare(strict_types=1);

namespace App\Libraries\Http;

use Config\Services;

final class Web3FormsClient
{
    /** @param null|callable(array): array{ok:bool,error?:string} $transport */
    public function __construct(private $transport = null)
    {
    }

    /** @param array<string, mixed> $payload */
    public function submit(array $payload): array
    {
        if ($this->transport !== null) {
            return ($this->transport)($payload);
        }
        $client = Services::curlrequest(['http_errors' => false, 'timeout' => 10], null, null, false);
        $res = $client->post('https://api.web3forms.com/submit', [
            'headers' => ['Content-Type' => 'application/json', 'Accept' => 'application/json'],
            'json' => $payload,
        ]);
        $data = json_decode((string) $res->getBody(), true);
        if ($res->getStatusCode() >= 200 && $res->getStatusCode() < 300 && ($data['success'] ?? false)) {
            return ['ok' => true];
        }

        return ['ok' => false, 'error' => (string) ($data['message'] ?? 'Submit failed')];
    }
}
