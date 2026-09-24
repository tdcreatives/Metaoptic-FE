<?php
declare(strict_types=1);

namespace Tests\Unit\Email;

use App\Libraries\Email\LogMailer;
use App\Libraries\Email\MailerInterface;
use App\Libraries\Email\MailMessage;
use App\Libraries\Email\SmtpMailer;
use CodeIgniter\Test\CIUnitTestCase;
use Config\Email;
use Config\Services;
use RuntimeException;

final class LogMailerTest extends CIUnitTestCase
{
    private string $logPath;

    protected function setUp(): void
    {
        parent::setUp();
        $this->logPath = WRITEPATH . 'logs/mail-test-' . bin2hex(random_bytes(4)) . '.log';
    }

    protected function tearDown(): void
    {
        if (is_file($this->logPath)) {
            unlink($this->logPath);
        }
        putenv('MAIL_DRIVER');
        unset($_ENV['MAIL_DRIVER'], $_SERVER['MAIL_DRIVER']);
        Services::reset(true);
        parent::tearDown();
    }

    public function test_send_appends_json_line_and_returns_id(): void
    {
        $mailer = new LogMailer($this->logPath);
        $id = $mailer->send(new MailMessage(
            'ir@example.com',
            'Hello',
            'plain body',
            '<p>html</p>',
        ));

        $this->assertNotSame('', $id);
        $this->assertFileExists($this->logPath);
        $line = trim((string) file_get_contents($this->logPath));
        $row = json_decode($line, true);
        $this->assertIsArray($row);
        $this->assertSame('ir@example.com', $row['to']);
        $this->assertSame('Hello', $row['subject']);
        $this->assertSame('plain body', $row['textBody']);
        $this->assertSame('<p>html</p>', $row['htmlBody']);
        $this->assertSame($id, $row['id']);
    }

    public function test_two_sends_append_two_lines(): void
    {
        $mailer = new LogMailer($this->logPath);
        $mailer->send(new MailMessage('a@example.com', 'A', 'a'));
        $mailer->send(new MailMessage('b@example.com', 'B', 'b'));

        $lines = array_values(array_filter(explode("\n", (string) file_get_contents($this->logPath))));
        $this->assertCount(2, $lines);
    }

    public function test_factory_defaults_to_log_mailer(): void
    {
        putenv('MAIL_DRIVER=log');
        $_ENV['MAIL_DRIVER'] = 'log';
        $mailer = Services::mailer(false);
        $this->assertInstanceOf(LogMailer::class, $mailer);
        $this->assertInstanceOf(MailerInterface::class, $mailer);
    }

    public function test_smtp_mailer_throws_when_host_empty(): void
    {
        $cfg = new Email();
        $cfg->SMTPHost = '';
        putenv('SMTP_HOST');
        unset($_ENV['SMTP_HOST'], $_SERVER['SMTP_HOST']);

        $this->expectException(RuntimeException::class);
        new SmtpMailer($cfg);
    }

    public function test_email_views_render_text(): void
    {
        $confirmation = view('emails/confirmation', [
            'unsubscribeUrl' => 'https://example.test/unsub',
        ]);
        $announcement = view('emails/announcement', [
            'title' => 'Filing title',
            'intro' => 'Intro copy',
            'unsubscribeUrl' => 'https://example.test/unsub',
        ]);
        $digest = view('emails/admin_digest', [
            'newCount' => 2,
            'refs' => ['REF1', 'REF2'],
        ]);

        $this->assertStringContainsString('unsubscribe', strtolower($confirmation));
        $this->assertStringContainsString('Filing title', $announcement);
        $this->assertStringContainsString('Intro copy', $announcement);
        $this->assertStringContainsString('2', $digest);
        $this->assertStringContainsString('REF1', $digest);
    }
}
