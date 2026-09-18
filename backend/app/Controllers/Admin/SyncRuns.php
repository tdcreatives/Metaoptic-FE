<?php
declare(strict_types=1);

namespace App\Controllers\Admin;

use App\Controllers\BaseController;
use App\Models\SyncRunModel;

class SyncRuns extends BaseController
{
    public function index(): string
    {
        return view('admin/sync_runs/index', [
            'title' => 'Sync runs',
            'runs' => model(SyncRunModel::class)->orderBy('id', 'DESC')->findAll(),
        ]);
    }
}
