<?= $this->extend('admin/layout') ?>
<?= $this->section('content') ?>
<h1><?= esc($title) ?></h1>
<?php if ($runs === [] || count($runs) === 0): ?>
    <p class="empty">No sync runs</p>
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
                <tr>
                    <td><?= esc((string) $row['id']) ?></td>
                    <td><span class="badge"><?= esc($row['status']) ?></span></td>
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
