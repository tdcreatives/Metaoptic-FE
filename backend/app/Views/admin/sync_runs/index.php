<?= $this->extend('admin/layout') ?>
<?= $this->section('content') ?>
<div class="page-head">
    <div class="page-head-row">
        <h1><?= esc($title) ?></h1>
    </div>
    <p class="form-hint">History of SGX announcement pulls. Use <strong>Sync data now</strong> only when you need an immediate refresh outside the daily cron.</p>
</div>

<?php if (session('message')): ?>
    <div class="flash flash-success"><?= esc((string) session('message')) ?></div>
<?php endif; ?>
<?php if (session('error')): ?>
    <div class="flash flash-error"><?= esc((string) session('error')) ?></div>
<?php endif; ?>

<div class="filter-row">
    <form class="inline-form" method="post" action="<?= site_url('admin/sync-runs/run-now') ?>" onsubmit="return confirm('Run SGX sync now?\n\nThis calls the live SGX feed, may take a minute, and will create a new sync-run row.\nIf another sync is already running, this request will fail safely.');">
        <?= csrf_field() ?>
        <button type="submit" class="btn btn-primary">Sync data now</button>
    </form>
</div>

<?php if ($runs === [] || count($runs) === 0): ?>
    <p class="empty">No sync runs yet. Run <strong>Sync data now</strong> or wait for the scheduled job.</p>
<?php else: ?>
<div class="table-wrap">
    <table class="table">
        <thead>
            <tr>
                <th>ID</th>
                <th>Status</th>
                <th>Started</th>
                <th>Finished</th>
                <th>Fetched</th>
                <th>New</th>
                <th>Updated</th>
                <th>Error</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($runs as $row): ?>
                <?php
                $status = (string) ($row['status'] ?? '');
                $badge = match ($status) {
                    'success' => 'badge-alert-sent',
                    'running' => 'badge-alert-scheduled',
                    'failed' => 'badge-alert-failed',
                    default => '',
                };
                ?>
                <tr>
                    <td><?= esc((string) $row['id']) ?></td>
                    <td><span class="badge <?= esc($badge, 'attr') ?>"><?= esc($status) ?></span></td>
                    <td><?= esc((string) $row['started_at']) ?></td>
                    <td><?= esc((string) ($row['finished_at'] ?? '')) ?></td>
                    <td><?= esc((string) $row['fetched_count']) ?></td>
                    <td><?= esc((string) $row['new_count']) ?></td>
                    <td><?= esc((string) $row['updated_count']) ?></td>
                    <td><?= esc((string) ($row['error_message'] ?? '')) ?></td>
                </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
</div>
<?php endif; ?>
<?= $this->endSection() ?>
