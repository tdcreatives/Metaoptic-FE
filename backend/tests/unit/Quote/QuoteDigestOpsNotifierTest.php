<?php
declare(strict_types=1);

namespace Tests\Unit\Quote;

use App\Libraries\Email\LogMailer;
use App\Libraries\Quote\QuoteDigestOpsNotifier;
use App\Models\AdminRecipientModel;
use CodeIgniter\Test\CIUnitTestCase;
use CodeIgniter\Test\DatabaseTestTrait;
use Config\Services;

final class QuoteDigestOpsNotifierTest extends CIUnitTestCase
{
    use DatabaseTestTrait;

    protected $migrate = true;
    protected $refresh = true;
    protected $namespace = 'App';

    public function test_notify_failure_logs_subject_for_active_admin_recipient(): void
    {
        (new AdminRecipientModel())->insert(['email' => 'ops@example.com', 'active' => 1]);
        (new AdminRecipientModel())->insert(['email' => 'inactive@example.com', 'active' => 0]);

        $logPath = WRITEPATH . 'logs/mail-quote-ops-' . bin2hex(random_bytes(4)) . '.log';
        Services::injectMock('mailer', new LogMailer($logPath));

        try {
            (new QuoteDigestOpsNotifier())->notifyFailure('2026-10-16', 'SGX fetch timed out');

            $this->assertFileExists($logPath);
            $row = json_decode(trim((string) file_get_contents($logPath)), true);
            $this->assertIsArray($row);
            $this->assertSame('ops@example.com', $row['to']);
            $this->assertSame('Daily 9MT digest failed — 2026-10-16', $row['subject']);
            $this->assertStringContainsString('SGX fetch timed out', (string) $row['textBody']);
        } finally {
            if (is_file($logPath)) {
                unlink($logPath);
            }
            Services::reset(true);
        }
    }

    public function test_notify_failure_includes_admin_run_url_when_run_id_present(): void
    {
        (new AdminRecipientModel())->insert(['email' => 'ops@example.com', 'active' => 1]);

        $logPath = WRITEPATH . 'logs/mail-quote-ops-' . bin2hex(random_bytes(4)) . '.log';
        Services::injectMock('mailer', new LogMailer($logPath));

        try {
            (new QuoteDigestOpsNotifier())->notifyFailure('2026-10-16', 'parse error', 42);

            $row = json_decode(trim((string) file_get_contents($logPath)), true);
            $this->assertIsArray($row);
            $this->assertStringContainsString(
                site_url('admin/quote-digest-runs/42'),
                (string) $row['textBody']
            );
        } finally {
            if (is_file($logPath)) {
                unlink($logPath);
            }
            Services::reset(true);
        }
    }
}
