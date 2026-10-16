<?= $this->extend('admin/layout') ?>
<?= $this->section('content') ?>
<?php $status = (string) ($status ?? ''); ?>
<div class="page-head page-head-row">
    <div>
        <h1>Email Alerts</h1>
        <p class="lead">Send investor emails about announcements that are already live on the website.</p>
    </div>
    <div class="spacer"></div>
    <a class="btn btn-primary" href="<?= site_url('admin/email-alerts/new') ?>">New email alert</a>
</div>

<?php if (session('message')): ?>
    <div class="flash flash-success"><?= esc((string) session('message')) ?></div>
<?php endif; ?>

<div class="note">
    Audience is picked automatically from the <b>categories</b> of the announcements you attach — only subscribers who opted into those categories receive it. Manage people under <b>Subscribers</b>.
</div>

<div class="filterbar">
    <nav class="seg" aria-label="Filter by status">
        <a class="<?= $status === '' ? 'is-on' : '' ?>" href="<?= site_url('admin/email-alerts') ?>">All</a>
        <a class="<?= $status === 'draft' ? 'is-on' : '' ?>" href="<?= site_url('admin/email-alerts?status=draft') ?>">Draft</a>
        <a class="<?= $status === 'scheduled' ? 'is-on' : '' ?>" href="<?= site_url('admin/email-alerts?status=scheduled') ?>">Scheduled</a>
        <a class="<?= $status === 'sending' ? 'is-on' : '' ?>" href="<?= site_url('admin/email-alerts?status=sending') ?>">Sending</a>
        <a class="<?= $status === 'sent' ? 'is-on' : '' ?>" href="<?= site_url('admin/email-alerts?status=sent') ?>">Sent</a>
    </nav>
</div>

<?php if ($alerts === [] || count($alerts) === 0): ?>
    <p class="empty">No email alerts yet. Publish an announcement to the live site first, then create an alert.</p>
<?php else: ?>
<div class="table-wrap">
    <table class="table tbl">
        <thead>
            <tr>
                <th>Subject</th>
                <th>Status</th>
                <th class="nowrap">When</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($alerts as $row): ?>
                <?php
                $st = (string) ($row['status'] ?? '');
                $pill = match ($st) {
                    'draft' => 'amber',
                    'scheduled', 'sending' => 'blue',
                    'sent' => 'green',
                    default => 'grey',
                };
                ?>
                <tr>
                    <td class="ttl"><a href="<?= site_url('admin/email-alerts/' . $row['id']) ?>"><?= esc($row['subject']) ?></a></td>
                    <td><span class="pill <?= esc($pill, 'attr') ?>"><span class="dot"></span><?= esc(ucfirst($st)) ?></span></td>
                    <td class="muted nowrap"><?= esc((string) ($row['scheduled_at'] ?? $row['sent_at'] ?? '')) ?></td>
                </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
</div>
<?php endif; ?>
<?= $this->endSection() ?>
