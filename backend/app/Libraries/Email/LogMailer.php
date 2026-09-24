<?php
declare(strict_types=1);

namespace App\Libraries\Email;

final class LogMailer implements MailerInterface
{
    public function __construct(private readonly string $logPath)
    {
    }

    public function send(MailMessage $message): string
    {
        $id = bin2hex(random_bytes(8));
        $dir = dirname($this->logPath);
        if (! is_dir($dir)) {
            mkdir($dir, 0755, true);
        }

        $line = json_encode([
            'id' => $id,
            'to' => $message->to,
            'subject' => $message->subject,
            'textBody' => $message->textBody,
            'htmlBody' => $message->htmlBody,
            'at' => date('c'),
        ], JSON_UNESCAPED_UNICODE) . "\n";

        file_put_contents($this->logPath, $line, FILE_APPEND | LOCK_EX);

        return $id;
    }
}
