<?php
declare(strict_types=1);

namespace Tests\Unit\Email;

use App\Commands\EmailDispatchScheduled;
use App\Models\EmailAlertModel;
use CodeIgniter\Test\CIUnitTestCase;
use CodeIgniter\Test\DatabaseTestTrait;

final class EmailDispatchScheduledTest extends CIUnitTestCase
{
    use DatabaseTestTrait;

    protected $migrate = true;
    protected $refresh = true;
    protected $namespace = 'App';

    public function test_domain_exception_demotes_due_alert_to_draft(): void
    {
        $id = (int) (new EmailAlertModel())->insert([
            'subject' => 'Orphan scheduled',
            'body_html' => '<p>x</p>',
            'status' => 'scheduled',
            'scheduled_at' => '2020-01-01 00:00:00',
        ], true);

        $cmd = new EmailDispatchScheduled(service('logger'), service('commands'));
        $this->assertSame(EXIT_SUCCESS, $cmd->run([]));

        $row = (new EmailAlertModel())->find($id);
        $this->assertSame('draft', $row['status']);
        $this->assertNull($row['scheduled_at']);
    }
}
