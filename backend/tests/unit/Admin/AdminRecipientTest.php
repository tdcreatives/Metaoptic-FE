<?php
declare(strict_types=1);

namespace Tests\Unit\Admin;

use App\Libraries\Admin\AdminDigestNotifier;
use App\Models\AdminRecipientModel;
use App\Models\AuditLogModel;
use CodeIgniter\Test\CIUnitTestCase;
use CodeIgniter\Test\DatabaseTestTrait;
use CodeIgniter\Test\FeatureTestTrait;
use Config\Services;

final class AdminRecipientTest extends CIUnitTestCase
{
    use DatabaseTestTrait;
    use FeatureTestTrait;

    protected $migrate = true;
    protected $refresh = true;
    protected $namespace = 'App';

    public function test_invalid_email_is_rejected(): void
    {
        $result = $this->withSession(['admin' => true])->post(
            '/admin/settings/recipients',
            $this->withCsrf(['email' => 'not-an-email'])
        );

        $result->assertRedirectTo('/admin/settings/recipients');
        $this->assertSame('invalid_email', session('error'));
        $this->assertSame(0, (new AdminRecipientModel())->countAllResults());
        $this->assertNull((new AuditLogModel())->where('action', 'settings_recipients')->first());
    }

    public function test_valid_email_is_added_and_audited(): void
    {
        $result = $this->withSession(['admin' => true])->post(
            '/admin/settings/recipients',
            $this->withCsrf(['email' => 'ops@example.com'])
        );

        $result->assertRedirectTo('/admin/settings/recipients');

        $row = (new AdminRecipientModel())->where('email', 'ops@example.com')->first();
        $this->assertNotNull($row);
        $this->assertSame(1, (int) $row['active']);

        $audit = (new AuditLogModel())->where('action', 'settings_recipients')->first();
        $this->assertNotNull($audit);
        $this->assertSame('admin_recipient', $audit['entity_type']);
        $this->assertSame((string) $row['id'], $audit['entity_id']);
    }

    public function test_duplicate_active_email_is_rejected(): void
    {
        (new AdminRecipientModel())->insert(['email' => 'ops@example.com', 'active' => 1]);

        $result = $this->withSession(['admin' => true])->post(
            '/admin/settings/recipients',
            $this->withCsrf(['email' => 'ops@example.com'])
        );

        $result->assertRedirectTo('/admin/settings/recipients');
        $this->assertSame('That email is already added', session('error'));
        $this->assertSame(1, (new AdminRecipientModel())->countAllResults());
        $this->assertNull((new AuditLogModel())->where('action', 'settings_recipients')->first());
    }

    public function test_duplicate_inactive_email_is_reactivated_and_audited(): void
    {
        $id = (int) (new AdminRecipientModel())->insert([
            'email' => 'ops@example.com',
            'active' => 0,
        ], true);

        $result = $this->withSession(['admin' => true])->post(
            '/admin/settings/recipients',
            $this->withCsrf(['email' => 'ops@example.com'])
        );

        $result->assertRedirectTo('/admin/settings/recipients');
        $row = (new AdminRecipientModel())->find($id);
        $this->assertSame(1, (int) $row['active']);
        $this->assertSame(1, (new AdminRecipientModel())->countAllResults());

        $audit = (new AuditLogModel())->where('action', 'settings_recipients')->first();
        $this->assertNotNull($audit);
        $this->assertSame((string) $id, $audit['entity_id']);
        $this->assertStringContainsString('reactivate', (string) $audit['metadata_json']);
    }

    public function test_deactivate_sets_inactive_and_audits(): void
    {
        $id = (int) (new AdminRecipientModel())->insert([
            'email' => 'gone@example.com',
            'active' => 1,
        ], true);

        $result = $this->withSession(['admin' => true])->post(
            '/admin/settings/recipients',
            $this->withCsrf(['id' => (string) $id, 'action' => 'deactivate'])
        );

        $result->assertRedirectTo('/admin/settings/recipients');
        $row = (new AdminRecipientModel())->find($id);
        $this->assertSame(0, (int) $row['active']);

        $audit = (new AuditLogModel())->where('action', 'settings_recipients')->first();
        $this->assertNotNull($audit);
        $this->assertSame((string) $id, $audit['entity_id']);
    }

    public function test_notifier_uses_active_recipients_and_log_mailer(): void
    {
        (new AdminRecipientModel())->insert(['email' => 'active@example.com', 'active' => 1]);
        (new AdminRecipientModel())->insert(['email' => 'old@example.com', 'active' => 0]);

        $logPath = WRITEPATH . 'logs/mail-test-digest-' . bin2hex(random_bytes(4)) . '.log';
        Services::injectMock('mailer', new \App\Libraries\Email\LogMailer($logPath));

        try {
            $notifier = new AdminDigestNotifier();
            $this->assertSame(['active@example.com'], $notifier->activeEmails());
            $notifier->notifyNewItems(2, ['REF1']);

            $this->assertFileExists($logPath);
            $row = json_decode(trim((string) file_get_contents($logPath)), true);
            $this->assertIsArray($row);
            $this->assertSame('active@example.com', $row['to']);
            $this->assertStringContainsString('2', (string) $row['textBody']);
            $this->assertStringContainsString('REF1', (string) $row['textBody']);
        } finally {
            if (is_file($logPath)) {
                unlink($logPath);
            }
            Services::reset(true);
        }
    }

    /** @param array<string, string> $fields */
    private function withCsrf(array $fields): array
    {
        helper('security');
        $fields[csrf_token()] = csrf_hash();

        return $fields;
    }
}
