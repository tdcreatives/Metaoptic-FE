<?= $this->extend('admin/layout') ?>
<?= $this->section('content') ?>
<div class="page-head">
    <div class="page-head-row">
        <h1><?= esc($title) ?></h1>
    </div>
</div>
<?php if (session('message')): ?>
    <div class="flash flash-success"><?= esc((string) session('message')) ?></div>
<?php endif; ?>

<aside class="page-guide" aria-label="Email Alerts tips">
    <span class="page-guide-label">How to use</span>
    <ol>
        <li>Create an alert only after the related announcement(s) are <strong>Published</strong>.</li>
        <li>Attach one or more announcements, write subject/body (use <code class="mono">{{announcement}}</code> to insert them).</li>
        <li>On the detail page: <strong>Send now</strong> or <strong>Schedule</strong>. Audience comes from subscriber categories of the attached items.</li>
        <li>Track status here: draft → scheduled/sending → sent. Subscriber lists live under <strong>Subscribers</strong>, not on this screen.</li>
    </ol>
</aside>

<p class="filter-row">
    <a class="btn btn-primary" href="<?= site_url('admin/email-alerts/new') ?>">New email alert</a>
</p>
<?php if ($alerts === [] || count($alerts) === 0): ?>
    <p class="empty">No email alerts yet. Publish an announcement first, then create an alert.</p>
<?php else: ?>
<div class="table-wrap">
    <table class="table">
        <thead>
            <tr>
                <th>Subject</th>
                <th>Status</th>
                <th>Scheduled</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($alerts as $row): ?>
                <tr>
                    <td><a href="<?= site_url('admin/email-alerts/' . $row['id']) ?>"><?= esc($row['subject']) ?></a></td>
                    <td><span class="badge"><?= esc($row['status']) ?></span></td>
                    <td><?= esc((string) ($row['scheduled_at'] ?? '')) ?></td>
                </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
</div>
<?php endif; ?>
<?= $this->endSection() ?>
