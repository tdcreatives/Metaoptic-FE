<?= $this->extend('admin/layout') ?>
<?= $this->section('content') ?>
<h1><?= esc($title) ?></h1>
<p>
    <a href="<?= site_url('admin') ?>">Dashboard</a>
    <a href="<?= site_url('admin/announcements') ?>">Announcements</a>
    <a href="<?= site_url('admin/settings/recipients') ?>">Recipients</a>
</p>
<table>
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
                <td><?= esc($row['status']) ?></td>
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
<?= $this->endSection() ?>
