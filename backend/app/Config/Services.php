<?php

namespace Config;

use App\Libraries\Admin\AuditLogger;
use App\Libraries\Email\LogMailer;
use App\Libraries\Email\MailerInterface;
use App\Libraries\Email\SmtpMailer;
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

    public static function auditLogger($getShared = true)
    {
        if ($getShared) {
            return static::getSharedInstance('auditLogger');
        }

        return new AuditLogger();
    }

    public static function mailer($getShared = true): MailerInterface
    {
        if ($getShared) {
            return static::getSharedInstance('mailer');
        }

        $driver = env('MAIL_DRIVER', 'log');
        if ($driver === 'smtp') {
            return new SmtpMailer(config('Email'));
        }

        return new LogMailer(WRITEPATH . 'logs/mail.log');
    }

    public static function turnstileVerifier($getShared = true): \App\Libraries\Http\TurnstileVerifier
    {
        if ($getShared) {
            return static::getSharedInstance('turnstileVerifier');
        }

        return new \App\Libraries\Http\TurnstileVerifier(config('Turnstile'));
    }

    /**
     * @param null|callable(array): array{ok:bool,error?:string} $transport
     */
    public static function web3FormsClient($getShared = true, ?callable $transport = null): \App\Libraries\Http\Web3FormsClient
    {
        if ($transport !== null) {
            return new \App\Libraries\Http\Web3FormsClient($transport);
        }
        if ($getShared) {
            return static::getSharedInstance('web3FormsClient');
        }

        return new \App\Libraries\Http\Web3FormsClient();
    }
}
