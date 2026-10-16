<?php
declare(strict_types=1);

namespace Tests\Feature\Admin;

use App\Models\QuoteDigestRunModel;
use CodeIgniter\Test\CIUnitTestCase;
use CodeIgniter\Test\DatabaseTestTrait;
use CodeIgniter\Test\FeatureTestTrait;

final class QuoteDigestRunsAdminTest extends CIUnitTestCase
{
    use DatabaseTestTrait;
    use FeatureTestTrait;

    protected $migrate = true;
    protected $refresh = true;
    protected $namespace = 'App';

    public function test_index_and_show_read_run_history(): void
    {
        $id = $this->seedRun();

        $index = $this->withSession(['admin' => true])->get('/admin/quote-digest-runs');
        $index->assertOK();
        $indexBody = $index->getBody();
        $this->assertStringContainsString('2026-10-16', $indexBody);
        $this->assertStringContainsString('Daily stock digest', $indexBody);
        $this->assertStringContainsString('admin/quote-digest-runs/' . $id, $indexBody);

        $show = $this->withSession(['admin' => true])->get('/admin/quote-digest-runs/' . $id);
        $show->assertOK();
        $this->assertStringContainsString('0.310', $show->getBody());
    }

    private function seedRun(): int
    {
        return (int) (new QuoteDigestRunModel())->insert([
            'digest_date' => '2026-10-16',
            'status' => 'success',
            'attempt_count' => 1,
            'recipient_count' => 2,
            'sent_count' => 2,
            'failed_count' => 0,
            'last_price' => 0.310,
            'change_abs' => 0.005,
            'change_pct' => 1.639,
            'quote_json' => json_encode(['nc' => '9MT', 'lt' => 0.31], JSON_THROW_ON_ERROR),
            'error_message' => null,
            'started_at' => '2026-10-16 16:00:00',
            'finished_at' => '2026-10-16 16:00:05',
        ], true);
    }
}
