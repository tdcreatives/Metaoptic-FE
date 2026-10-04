<?php
declare(strict_types=1);

namespace App\Controllers\Admin;

use App\Controllers\BaseController;
use App\Libraries\Sgx\SgxSyncRunner;
use App\Models\SyncRunModel;
use CodeIgniter\HTTP\RedirectResponse;
use CodeIgniter\HTTP\ResponseInterface;

class SyncRuns extends BaseController
{
    public function index(): string
    {
        return view('admin/sync_runs/index', [
            'title' => 'Sync runs',
            'runs' => model(SyncRunModel::class)->orderBy('id', 'DESC')->findAll(100),
        ]);
    }

    public function runNow(): RedirectResponse|ResponseInterface
    {
        // Admin AJAX can wait several minutes for SGX list + HTML enrich.
        @set_time_limit(600);

        $out = (new SgxSyncRunner())->run();
        service('auditLogger')->write('sync_now', 'sync_run', null, [
            'ok' => $out['ok'],
            'locked' => $out['locked'],
        ]);

        if ($this->wantsJson()) {
            $status = 200;
            if (! $out['ok']) {
                $status = $out['locked'] ? 409 : 500;
            }

            return $this->response->setStatusCode($status)->setJSON([
                'ok' => $out['ok'],
                'locked' => $out['locked'],
                'message' => $out['message'],
            ]);
        }

        if (! $out['ok']) {
            return redirect()->to('/admin/sync-runs')->with('error', $out['message']);
        }

        return redirect()->to('/admin/sync-runs')->with('message', $out['message']);
    }

    private function wantsJson(): bool
    {
        $accept = strtolower($this->request->getHeaderLine('Accept'));
        if (str_contains($accept, 'application/json')) {
            return true;
        }

        return $this->request->getHeaderLine('X-Requested-With') === 'XMLHttpRequest';
    }
}
