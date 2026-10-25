<?php
declare(strict_types=1);

namespace Tests\Unit\Admin;

use App\Libraries\Admin\AdminDigestNotifier;
use App\Libraries\Email\LogMailer;
use App\Models\AdminRecipientModel;
use CodeIgniter\Test\CIUnitTestCase;
use CodeIgniter\Test\DatabaseTestTrait;
use Config\Services;

final class AdminDigestNotifierTest extends CIUnitTestCase
{
    use DatabaseTestTrait;

    protected $migrate = true;
    protected $refresh = true;
    protected $namespace = 'App';

    public function test_log_mailer_writes_one_line_per_active_recipient(): void
    {
        (new AdminRecipientModel())->insert(['email' => 'ops@example.com', 'active' => 1]);
        (new AdminRecipientModel())->insert(['email' => 'ir@example.com', 'active' => 1]);
        (new AdminRecipientModel())->insert(['email' => 'old@example.com', 'active' => 0]);

        $logPath = WRITEPATH . 'logs/mail-digest-' . bin2hex(random_bytes(4)) . '.log';
        Services::injectMock('mailer', new LogMailer($logPath));

        try {
            (new AdminDigestNotifier())->notifyNewItems(2, ['SGX-REF-1']);

            $this->assertFileExists($logPath);
            $lines = array_values(array_filter(explode("\n", (string) file_get_contents($logPath))));
            $this->assertCount(2, $lines);

            $rows = array_map(static fn (string $line): array => json_decode($line, true), $lines);
            $tos = array_column($rows, 'to');
            sort($tos);
            $this->assertSame(['ir@example.com', 'ops@example.com'], $tos);

            foreach ($rows as $row) {
                $this->assertSame('[IR] 2 new SGX announcement(s)', $row['subject']);
                $this->assertStringContainsString('2', (string) $row['textBody']);
                $this->assertStringContainsString('SGX-REF-1', (string) $row['textBody']);
            }
        } finally {
            if (is_file($logPath)) {
                unlink($logPath);
            }
            Services::reset(true);
        }
    }
}
