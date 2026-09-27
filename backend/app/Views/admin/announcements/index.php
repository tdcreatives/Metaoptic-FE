<?= $this->extend('admin/layout') ?>
<?= $this->section('content') ?>
<h1><?= esc($title) ?></h1>
<p class="filter-row">
    <a href="<?= site_url('admin/announcements') ?>">All</a>
    <a href="<?= site_url('admin/announcements?state=pending_review') ?>">Pending</a>
    <a href="<?= site_url('admin/announcements?state=published') ?>">Published</a>
</p>
<?php if ($announcements === [] || count($announcements) === 0): ?>
    <p class="empty">No announcements</p>
<?php else: ?>
<div class="table-wrap">
    <table class="table">
        <thead>
            <tr>
                <th>Title</th>
                <th>State</th>
                <th>Filed</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($announcements as $row): ?>
                <tr>
                    <td><a href="<?= site_url('admin/announcements/' . $row['id']) ?>"><?= esc($row['title']) ?></a></td>
                    <td><span class="badge"><?= esc($row['state']) ?></span></td>
                    <td><?= esc((string) $row['filed_at']) ?></td>
                </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
</div>
<?php endif; ?>
<?= $this->endSection() ?>
