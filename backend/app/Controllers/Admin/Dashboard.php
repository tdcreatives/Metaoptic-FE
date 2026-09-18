<?php
declare(strict_types=1);

namespace App\Controllers\Admin;

use App\Controllers\BaseController;

class Dashboard extends BaseController
{
    public function index(): string
    {
        $counts = db_connect()->table('announcements')->select("
  SUM(state='pending_review') AS pending,
  SUM(state='published') AS published,
  SUM(needs_review=1) AS needs_review
", false)->get()->getRowArray() ?? [];

        return view('admin/dashboard', [
            'title' => 'Dashboard',
            'pending' => (int) ($counts['pending'] ?? 0),
            'published' => (int) ($counts['published'] ?? 0),
            'needs_review' => (int) ($counts['needs_review'] ?? 0),
        ]);
    }
}
