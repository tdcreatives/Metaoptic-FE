<?= $this->extend('admin/layout') ?>
<?= $this->section('content') ?>
<h1><?= esc($title) ?></h1>
<p>
    <a href="<?= site_url('admin') ?>">Dashboard</a>
    <a href="<?= site_url('admin/announcements') ?>">Announcements</a>
    <a href="<?= site_url('admin/sync-runs') ?>">Sync runs</a>
</p>
<?php if (session('message')): ?>
    <p><?= esc((string) session('message')) ?></p>
<?php endif; ?>
<?php if (session('error')): ?>
    <p><?= esc((string) session('error')) ?></p>
<?php endif; ?>
<form method="post" action="<?= site_url('admin/settings/recipients') ?>">
    <?= csrf_field() ?>
    <label>Email
        <input type="email" name="email" required>
    </label>
    <button type="submit">Add</button>
</form>
<table>
    <thead>
        <tr>
            <th>Email</th>
            <th>Active</th>
            <th></th>
        </tr>
    </thead>
    <tbody>
        <?php foreach ($recipients as $row): ?>
            <tr>
                <td><?= esc($row['email']) ?></td>
                <td><?= ((int) $row['active'] === 1) ? 'yes' : 'no' ?></td>
                <td>
                    <?php if ((int) $row['active'] === 1): ?>
                        <form method="post" action="<?= site_url('admin/settings/recipients') ?>">
                            <?= csrf_field() ?>
                            <input type="hidden" name="id" value="<?= esc((string) $row['id'], 'attr') ?>">
                            <input type="hidden" name="action" value="deactivate">
                            <button type="submit">Deactivate</button>
                        </form>
                    <?php endif; ?>
                </td>
            </tr>
        <?php endforeach; ?>
    </tbody>
</table>
<?= $this->endSection() ?>
