<?php
declare(strict_types=1);

namespace Tests\Unit\Admin;

use App\Libraries\Admin\SubscriberDirectory;
use App\Models\SubscriberCategoryModel;
use App\Models\SubscriberModel;
use CodeIgniter\Test\CIUnitTestCase;
use CodeIgniter\Test\DatabaseTestTrait;
use DomainException;

final class SubscriberDirectoryTest extends CIUnitTestCase
{
    use DatabaseTestTrait;

    protected $migrate = true;
    protected $refresh = true;
    protected $namespace = 'App';

    public function test_list_omits_token_and_includes_categories(): void
    {
        $id = $this->insertActive('qa-list@example.test', ['General Announcement', 'Placements']);

        $rows = (new SubscriberDirectory())->list([]);
        $this->assertCount(1, $rows);
        $this->assertSame('qa-list@example.test', $rows[0]['email']);
        $this->assertSame(['General Announcement', 'Placements'], $rows[0]['categories']);
        $this->assertArrayNotHasKey('unsubscribe_token_hash', $rows[0]);
        $this->assertSame(1, (new SubscriberDirectory())->countActive());
        unset($id);
    }

    public function test_filter_by_category_and_q(): void
    {
        $this->insertActive('alpha@example.test', ['Placements']);
        $this->insertActive('beta@example.test', ['General Announcement']);

        $byCat = (new SubscriberDirectory())->list(['category' => 'Placements']);
        $this->assertCount(1, $byCat);
        $this->assertSame('alpha@example.test', $byCat[0]['email']);

        $byQ = (new SubscriberDirectory())->list(['q' => 'beta@']);
        $this->assertCount(1, $byQ);
        $this->assertSame('beta@example.test', $byQ[0]['email']);
    }

    public function test_unsubscribe_by_id_and_audit(): void
    {
        $id = $this->insertActive('bye@example.test', ['General Announcement']);
        (new SubscriberDirectory())->unsubscribeById($id);

        $row = (new SubscriberModel())->find($id);
        $this->assertSame('unsubscribed', $row['status']);
        $this->assertNotEmpty($row['unsubscribed_at']);
        $this->assertSame(0, (new SubscriberDirectory())->countActive());

        $audit = db_connect()->table('audit_log')
            ->where('action', 'unsubscribe')
            ->where('entity_type', 'subscriber')
            ->where('entity_id', (string) $id)
            ->get()
            ->getRowArray();
        $this->assertNotNull($audit);
        $this->assertStringNotContainsString('bye@', (string) ($audit['metadata_json'] ?? ''));

        $this->expectException(DomainException::class);
        (new SubscriberDirectory())->unsubscribeById($id);
    }

    public function test_export_audits_count_only(): void
    {
        $this->insertActive('csv@example.test', ['General Announcement']);
        $rows = (new SubscriberDirectory())->exportRows([]);
        $this->assertCount(1, $rows);

        $audit = db_connect()->table('audit_log')
            ->where('action', 'export')
            ->where('entity_type', 'subscriber')
            ->get()
            ->getRowArray();
        $this->assertNotNull($audit);
        $this->assertStringContainsString('"count":1', (string) $audit['metadata_json']);
        $this->assertStringNotContainsString('csv@', (string) $audit['metadata_json']);
    }

    /** @param list<string> $categories */
    private function insertActive(string $email, array $categories): int
    {
        $model = new SubscriberModel();
        $id = (int) $model->insert([
            'email' => $email,
            'first_name' => 'QA',
            'last_name' => 'Test',
            'status' => 'active',
            'consented_at' => date('Y-m-d H:i:s'),
            'unsubscribe_token_hash' => hash('sha256', $email),
        ], true);

        $cats = new SubscriberCategoryModel();
        foreach ($categories as $key) {
            $cats->insert([
                'subscriber_id' => $id,
                'category_key' => $key,
            ]);
        }

        return $id;
    }
}
