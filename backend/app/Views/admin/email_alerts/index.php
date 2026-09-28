<?= $this->extend('admin/layout') ?>
<?= $this->section('content') ?>
<h1><?= esc($title) ?></h1>
<?php if (session('message')): ?>
    <div class="flash flash-success"><?= esc((string) session('message')) ?></div>
<?php endif; ?>
<p class="filter-row">
    <a class="btn btn-primary" href="<?= site_url('admin/email-alerts/new') ?>">New email alert</a>
</p>
<?php if ($alerts === [] || count($alerts) === 0): ?>
    <p class="empty">No email alerts</p>
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
