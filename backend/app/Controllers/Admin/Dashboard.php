<?php
declare(strict_types=1);

namespace App\Controllers\Admin;

use App\Controllers\BaseController;
use App\Libraries\Admin\PublishToLiveSiteService;
use App\Libraries\Admin\SubscriberDirectory;

class Dashboard extends BaseController
{
    public function index(): string
    {
        $db = db_connect();
        $counts = $db->table('announcements')->select("
  SUM(state='pending_review') AS pending,
  SUM(state='published' AND (live_at IS NULL OR needs_review=1)) AS ready,
  SUM(state='published' AND live_at IS NOT NULL AND needs_review=0) AS live,
  SUM(needs_review=1) AS needs_review_flag
", false)->get()->getRowArray() ?? [];

        $alerts = $db->table('email_alerts')->select("
  SUM(status='draft') AS alert_draft,
  SUM(status='scheduled') AS alert_scheduled,
  SUM(status='sending') AS alert_sending,
  SUM(status='sent') AS alert_sent
", false)->get()->getRowArray() ?? [];

        $readyRows = $db->table('announcements')
            ->select('id, title')
            ->where('state', 'published')
            ->groupStart()
                ->where('live_at IS NULL', null, false)
                ->orWhere('needs_review', 1)
            ->groupEnd()
            ->orderBy('filed_at', 'DESC')
            ->limit(5)
            ->get()
            ->getResultArray();

        $lastSync = $db->table('sync_runs')
            ->orderBy('id', 'DESC')
            ->limit(1)
            ->get()
            ->getRowArray();

        $subscribersActive = (new SubscriberDirectory())->countActive();

        return view('admin/dashboard', [
            'title' => 'Dashboard',
            'greeting' => 'Good morning',
            'pending' => (int) ($counts['pending'] ?? 0),
            'ready' => (int) ($counts['ready'] ?? 0),
            'live' => (int) ($counts['live'] ?? 0),
            'needs_review' => (int) ($counts['needs_review_flag'] ?? 0),
            'alert_draft' => (int) ($alerts['alert_draft'] ?? 0),
            'alert_scheduled' => (int) ($alerts['alert_scheduled'] ?? 0),
            'alert_sending' => (int) ($alerts['alert_sending'] ?? 0),
            'alert_sent' => (int) ($alerts['alert_sent'] ?? 0),
            'subscribers_active' => $subscribersActive,
            'pending_live_sync' => PublishToLiveSiteService::pendingCount(),
            'ready_preview' => $readyRows,
            'last_sync' => $lastSync,
        ]);
    }
}
