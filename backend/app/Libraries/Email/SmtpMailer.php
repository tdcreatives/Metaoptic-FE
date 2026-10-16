<?php
declare(strict_types=1);

namespace App\Libraries\Email;

use CodeIgniter\Email\Email;
use Config\Email as EmailConfig;
use RuntimeException;

final class SmtpMailer implements MailerInterface
{
    public function __construct(private readonly EmailConfig $config)
    {
        if ($this->smtpHost() === '') {
            throw new RuntimeException('SMTP host is empty');
        }
    }

    public function send(MailMessage $message): string
    {
        $this->config->protocol = 'smtp';
        $this->config->SMTPHost = $this->smtpHost();
        $port = (int) env('SMTP_PORT', $this->config->SMTPPort);
        if ($port > 0) {
            $this->config->SMTPPort = $port;
        }
        $user = (string) env('SMTP_USER', $this->config->SMTPUser);
        if ($user !== '') {
            $this->config->SMTPUser = $user;
        }
        $pass = (string) env('SMTP_PASS', $this->config->SMTPPass);
        if ($pass !== '') {
            $this->config->SMTPPass = $pass;
        }

        $email = new Email($this->config);
        $from = $this->fromAddress();
        if ($from !== '') {
            $email->setFrom($from, $this->config->fromName);
        }
        $email->setTo($message->to);
        $email->setSubject($message->subject);
        if ($message->htmlBody !== null) {
            $email->setMailType('html');
            $email->setMessage($message->htmlBody);
            $email->setAltMessage($message->textBody);
        } else {
            $email->setMailType('text');
            $email->setMessage($message->textBody);
        }

        if (! $email->send()) {
            throw new RuntimeException('SMTP send failed');
        }

        return bin2hex(random_bytes(8));
    }

    private function smtpHost(): string
    {
        $host = trim($this->config->SMTPHost);
        if ($host !== '') {
            return $host;
        }

        return trim((string) env('SMTP_HOST', ''));
    }

    private function fromAddress(): string
    {
        if ($this->config->fromEmail !== '') {
            return $this->config->fromEmail;
        }

        return (string) env('mail.from', '');
    }
}
