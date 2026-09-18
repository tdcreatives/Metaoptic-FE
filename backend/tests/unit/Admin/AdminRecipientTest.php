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

    public function test_notifier_uses_active_recipients_and_log_fallback(): void
    {
        (new AdminRecipientModel())->insert(['email' => 'active@example.com', 'active' => 1]);
        (new AdminRecipientModel())->insert(['email' => 'old@example.com', 'active' => 0]);

        $this->assertFalse(method_exists(Services::class, 'mailer'));

        $notifier = new AdminDigestNotifier();
        $this->assertSame(['active@example.com'], $notifier->activeEmails());
        $notifier->notifyNewItems(2, ['REF1']);
    }

    /** @param array<string, string> $fields */
    private function withCsrf(array $fields): array
    {
        helper('security');
        $fields[csrf_token()] = csrf_hash();

        return $fields;
    }
}
