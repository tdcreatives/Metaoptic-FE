<?php
declare(strict_types=1);

namespace Tests\Database;

use CodeIgniter\Test\CIUnitTestCase;
use CodeIgniter\Test\DatabaseTestTrait;

final class QuoteDigestRunsMigrationTest extends CIUnitTestCase
{
    use DatabaseTestTrait;

    protected $migrate = true;
    protected $refresh = true;
    protected $namespace = 'App';

    public function test_quote_digest_runs_table_exists_with_unique_digest_date(): void
    {
        $this->assertTrue($this->db->tableExists('quote_digest_runs'));

        $fields = array_column($this->db->getFieldData('quote_digest_runs'), 'name');
        foreach ([
            'id',
            'digest_date',
            'status',
            'attempt_count',
            'recipient_count',
            'sent_count',
            'failed_count',
            'last_price',
            'change_abs',
            'change_pct',
            'quote_json',
            'error_message',
            'started_at',
            'finished_at',
            'created_at',
            'updated_at',
        ] as $col) {
            $this->assertContains($col, $fields);
        }

        $hasUniqueOnDigestDate = false;
        foreach ($this->db->getIndexData('quote_digest_runs') as $index) {
            if (strtolower((string) $index->type) !== 'unique') {
                continue;
            }
            $cols = array_map('strtolower', (array) $index->fields);
            if (in_array('digest_date', $cols, true)) {
                $hasUniqueOnDigestDate = true;
                break;
            }
        }
        $this->assertTrue($hasUniqueOnDigestDate, 'Expected unique index on digest_date');
    }
}
