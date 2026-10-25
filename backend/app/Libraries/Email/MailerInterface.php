<?php
declare(strict_types=1);

namespace App\Libraries\Email;

interface MailerInterface
{
    /** @return string provider id */
    public function send(MailMessage $message): string;
}
