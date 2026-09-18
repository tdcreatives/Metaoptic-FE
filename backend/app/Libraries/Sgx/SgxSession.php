<?php
declare(strict_types=1);

namespace App\Libraries\Sgx;

use Config\Sgx;

final class SgxSession
{
    private bool $ready = false;

    /** @param callable(string, string, array<string, string>): string $transport */
    public function __construct(
        private readonly Sgx $config,
        private $transport,
    ) {
    }

    public function refresh(): void
    {
        if ($this->ready) {
            return;
        }
        // TODO(TDC): cookie jar + real SGX URLs when production fetch is gated.
        ($this->transport)('GET', $this->config->baseURL . '/session', $this->requestHeaders());
        $this->ready = true;
    }

    /** @return array<string, string> */
    public function headers(): array
    {
        $this->refresh();

        return $this->requestHeaders();
    }

    /** @return array<string, string> */
    private function requestHeaders(): array
    {
        return [
            'Accept' => 'application/json',
        ];
    }
}
