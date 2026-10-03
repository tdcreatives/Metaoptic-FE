<?php
declare(strict_types=1);

namespace App\Controllers\Admin;

use App\Controllers\BaseController;
use App\Libraries\Sgx\SgxSyncRunner;
use App\Models\SyncRunModel;
use CodeIgniter\HTTP\RedirectResponse;

class SyncRuns extends BaseController
{
    public function index(): string
    {
        return view('admin/sync_runs/index', [
            'title' => 'Sync runs',
            'runs' => model(SyncRunModel::class)->orderBy('id', 'DESC')->findAll(100),
        ]);
    }

    public function runNow(): RedirectResponse
    {
        $out = (new SgxSyncRunner())->run();
        service('auditLogger')->write('sync_now', 'sync_run', null, [
            'ok' => $out['ok'],
            'locked' => $out['locked'],
        ]);

        if (! $out['ok']) {
            return redirect()->to('/admin/sync-runs')->with('error', $out['message']);
        }

        return redirect()->to('/admin/sync-runs')->with('message', $out['message']);
    }
}
