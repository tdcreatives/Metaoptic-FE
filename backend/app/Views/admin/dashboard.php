<?= $this->extend('admin/layout') ?>
<?= $this->section('content') ?>
<div class="page-head">
    <div class="page-head-row">
        <h1><?= esc($title) ?></h1>
    </div>
</div>

<aside class="page-guide" aria-label="How to use this CMS">
    <span class="page-guide-label">Quick start</span>
    <p>Use the cards below as a health check, then jump into the area that needs attention.</p>
    <ol>
        <li><strong>Sync history</strong> — pull latest SGX filings when the daily job is not enough.</li>
        <li><strong>Announcements</strong> — review pending items, Preview, then Publish to the website.</li>
        <li><strong>Email Alerts</strong> — after publish, compose and send/schedule investor emails.</li>
        <li><strong>Subscribers</strong> — check who opted in; export CSV or mark unsubscribed if needed.</li>
    </ol>
</aside>

<div class="stat-grid">
    <a class="stat-card" href="<?= site_url('admin/announcements?state=pending_review') ?>">
        <span class="label">Pending</span>
        <span class="value"><?= esc((string) $pending) ?></span>
    </a>
    <a class="stat-card" href="<?= site_url('admin/announcements?state=published') ?>">
        <span class="label">Published</span>
        <span class="value"><?= esc((string) $published) ?></span>
    </a>
    <a class="stat-card" href="<?= site_url('admin/announcements?needs_review=1') ?>">
        <span class="label">Needs review</span>
        <span class="value"><?= esc((string) $needs_review) ?></span>
    </a>
    <a class="stat-card" href="<?= site_url('admin/email-alerts?status=draft') ?>">
        <span class="label">Alert drafts</span>
        <span class="value"><?= esc((string) $alert_draft) ?></span>
    </a>
    <a class="stat-card" href="<?= site_url('admin/email-alerts?status=scheduled') ?>">
        <span class="label">Alert scheduled</span>
        <span class="value"><?= esc((string) $alert_scheduled) ?></span>
    </a>
    <a class="stat-card" href="<?= site_url('admin/email-alerts?status=sending') ?>">
        <span class="label">Alert sending</span>
        <span class="value"><?= esc((string) $alert_sending) ?></span>
    </a>
    <a class="stat-card" href="<?= site_url('admin/email-alerts?status=sent') ?>">
        <span class="label">Alert sent</span>
        <span class="value"><?= esc((string) $alert_sent) ?></span>
    </a>
    <a class="stat-card" href="<?= site_url('admin/subscribers?status=active') ?>">
        <span class="label">Active subscribers</span>
        <span class="value"><?= esc((string) $subscribers_active) ?></span>
    </a>
</div>
<p class="btn-row">
    <a class="btn btn-primary" href="<?= site_url('admin/announcements') ?>">Announcements</a>
    <a class="btn btn-secondary" href="<?= site_url('admin/email-alerts') ?>">Email Alerts</a>
    <a class="btn btn-secondary" href="<?= site_url('admin/subscribers') ?>">Subscribers</a>
    <a class="btn btn-secondary" href="<?= site_url('admin/sync-runs') ?>">Sync history</a>
    <a class="btn btn-secondary" href="<?= site_url('admin/settings/recipients') ?>">Settings</a>
</p>
<?= $this->endSection() ?>
