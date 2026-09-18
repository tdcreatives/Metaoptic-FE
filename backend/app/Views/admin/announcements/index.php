<?= $this->extend('admin/layout') ?>
<?= $this->section('content') ?>
<h1><?= esc($title) ?></h1>
<p>
    <a href="<?= site_url('admin/announcements') ?>">All</a>
    <a href="<?= site_url('admin/announcements?state=pending_review') ?>">Pending</a>
    <a href="<?= site_url('admin/announcements?state=published') ?>">Published</a>
</p>
<table>
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
                <td><?= esc($row['state']) ?></td>
                <td><?= esc((string) $row['filed_at']) ?></td>
            </tr>
        <?php endforeach; ?>
    </tbody>
</table>
<?= $this->endSection() ?>
