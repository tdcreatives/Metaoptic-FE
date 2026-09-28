<?= $this->extend('admin/layout') ?>
<?= $this->section('content') ?>
<h1><?= esc($title) ?></h1>
<div class="stat-grid">
    <div class="stat-card">
        <span class="label">Pending</span>
        <span class="value"><?= esc((string) $pending) ?></span>
    </div>
    <div class="stat-card">
        <span class="label">Published</span>
        <span class="value"><?= esc((string) $published) ?></span>
    </div>
    <div class="stat-card">
        <span class="label">Needs review</span>
        <span class="value"><?= esc((string) $needs_review) ?></span>
    </div>
    <div class="stat-card">
        <span class="label">Alert drafts</span>
        <span class="value"><?= esc((string) $alert_draft) ?></span>
    </div>
    <div class="stat-card">
        <span class="label">Alert scheduled</span>
        <span class="value"><?= esc((string) $alert_scheduled) ?></span>
    </div>
    <div class="stat-card">
        <span class="label">Alert sending</span>
        <span class="value"><?= esc((string) $alert_sending) ?></span>
    </div>
    <div class="stat-card">
        <span class="label">Alert sent</span>
        <span class="value"><?= esc((string) $alert_sent) ?></span>
    </div>
</div>
<p class="btn-row">
    <a class="btn btn-primary" href="<?= site_url('admin/announcements') ?>">Announcements</a>
    <a class="btn btn-secondary" href="<?= site_url('admin/email-alerts') ?>">Email Alerts</a>
    <a class="btn btn-secondary" href="<?= site_url('admin/sync-runs') ?>">Sync history</a>
    <a class="btn btn-secondary" href="<?= site_url('admin/settings/recipients') ?>">Settings</a>
</p>
<?= $this->endSection() ?>
