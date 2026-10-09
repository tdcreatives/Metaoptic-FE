<?php
declare(strict_types=1);

namespace App\Controllers\Admin;

use App\Controllers\BaseController;
use App\Libraries\Admin\SubscriberDirectory;

class Dashboard extends BaseController
{
    public function index(): string
    {
        $counts = db_connect()->table('announcements')->select("
  SUM(state='pending_review') AS pending,
  SUM(state='published') AS published,
  SUM(needs_review=1) AS needs_review
", false)->get()->getRowArray() ?? [];

        $alerts = db_connect()->table('email_alerts')->select("
  SUM(status='draft') AS alert_draft,
  SUM(status='scheduled') AS alert_scheduled,
  SUM(status='sending') AS alert_sending,
  SUM(status='sent') AS alert_sent
", false)->get()->getRowArray() ?? [];

        return view('admin/dashboard', [
            'title' => 'Dashboard',
            'pending' => (int) ($counts['pending'] ?? 0),
            'published' => (int) ($counts['published'] ?? 0),
            'needs_review' => (int) ($counts['needs_review'] ?? 0),
            'alert_draft' => (int) ($alerts['alert_draft'] ?? 0),
            'alert_scheduled' => (int) ($alerts['alert_scheduled'] ?? 0),
            'alert_sending' => (int) ($alerts['alert_sending'] ?? 0),
            'alert_sent' => (int) ($alerts['alert_sent'] ?? 0),
            'subscribers_active' => (new SubscriberDirectory())->countActive(),
        ]);
    }
}
