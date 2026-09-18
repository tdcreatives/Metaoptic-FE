<?php

namespace Config;

use CodeIgniter\Config\BaseService;

/**
 * Services Configuration file.
 *
 * Services are simply other classes/libraries that the system uses
 * to do its job. This is used by CodeIgniter to allow the core of the
 * framework to be swapped out easily without affecting the usage within
 * the rest of your application.
 *
 * This file holds any application-specific services, or service overrides
 * that you might need. An example has been included with the general
 * method format you should use for your service methods. For more examples,
 * see the core Services file at system/Config/Services.php.
 */
class Services extends BaseService
{
    /**
     * @param (callable(string, string, array<string, string>): string)|null $transport
     */
    public static function sgxClient($getShared = true, ?callable $transport = null)
    {
        if ($transport !== null) {
            return new \App\Libraries\Sgx\SgxHttpClient(config('Sgx'), $transport);
        }
        if ($getShared) {
            return static::getSharedInstance('sgxClient');
        }

        return new \App\Libraries\Sgx\SgxHttpClient(config('Sgx'));
    }
}
