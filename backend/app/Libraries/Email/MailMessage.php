<?php
declare(strict_types=1);

namespace App\Libraries\Email;

final class MailMessage
{
    public function __construct(
        public string $to,
        public string $subject,
        public string $textBody,
        public ?string $htmlBody = null,
    ) {
    }
}
