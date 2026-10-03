<?= $this->extend('admin/layout') ?>
<?= $this->section('content') ?>
<?php
$status = (string) ($filters['status'] ?? '');
$category = (string) ($filters['category'] ?? '');
$q = (string) ($filters['q'] ?? '');
$queryBase = array_filter([
    'category' => $category !== '' ? $category : null,
    'q' => $q !== '' ? $q : null,
]);
?>
<div class="page-head">
    <div class="page-head-row">
        <h1><?= esc($title) ?></h1>
        <div class="page-head-meta">
            <span class="badge badge-sub-active"><?= esc((string) $activeCount) ?> active</span>
        </div>
    </div>
    <p class="form-hint">Investors who signed up on the public Email Alerts form. Unsubscribe tokens are never shown here.</p>
</div>

<?php if (session('message')): ?>
    <div class="flash flash-success"><?= esc((string) session('message')) ?></div>
<?php endif; ?>
<?php if (session('error')): ?>
    <div class="flash flash-error"><?= esc((string) session('error')) ?></div>
<?php endif; ?>

<p class="filter-row">
    <a class="<?= $status === '' ? 'is-active' : '' ?>" href="<?= site_url('admin/subscribers?' . http_build_query($queryBase)) ?>">All</a>
    <a class="<?= $status === 'active' ? 'is-active' : '' ?>" href="<?= site_url('admin/subscribers?' . http_build_query($queryBase + ['status' => 'active'])) ?>">Active</a>
    <a class="<?= $status === 'unsubscribed' ? 'is-active' : '' ?>" href="<?= site_url('admin/subscribers?' . http_build_query($queryBase + ['status' => 'unsubscribed'])) ?>">Unsubscribed</a>
    <a class="btn btn-secondary" href="<?= site_url('admin/subscribers/export?' . http_build_query(array_filter([
        'status' => $status !== '' ? $status : null,
        'category' => $category !== '' ? $category : null,
        'q' => $q !== '' ? $q : null,
    ]))) ?>">Export CSV</a>
</p>

<form class="card filter-bar" method="get" action="<?= site_url('admin/subscribers') ?>">
    <?php if ($status !== ''): ?>
        <input type="hidden" name="status" value="<?= esc($status, 'attr') ?>">
    <?php endif; ?>
    <div class="form-group">
        <label class="label" for="category">Category</label>
        <select class="input" id="category" name="category">
            <option value="">All categories</option>
            <?php foreach ($categories as $cat): ?>
                <option value="<?= esc($cat, 'attr') ?>" <?= $category === $cat ? 'selected' : '' ?>><?= esc($cat) ?></option>
            <?php endforeach; ?>
        </select>
    </div>
    <div class="form-group">
        <label class="label" for="q">Email</label>
        <input class="input" id="q" type="search" name="q" value="<?= esc($q, 'attr') ?>" placeholder="contains…">
    </div>
    <div class="filter-bar-actions">
        <button type="submit" class="btn btn-primary">Apply filters</button>
        <?php if ($category !== '' || $q !== ''): ?>
            <a class="btn btn-secondary" href="<?= site_url('admin/subscribers?' . http_build_query(array_filter(['status' => $status !== '' ? $status : null]))) ?>">Clear</a>
        <?php endif; ?>
    </div>
</form>

<?php if ($subscribers === [] || count($subscribers) === 0): ?>
    <p class="empty">No subscribers match.</p>
<?php else: ?>
<div class="table-wrap">
    <table class="table">
        <thead>
            <tr>
                <th>Email</th>
                <th>Name</th>
                <th>Status</th>
                <th>Categories</th>
                <th>Consented</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($subscribers as $row): ?>
                <?php
                $rowStatus = (string) ($row['status'] ?? '');
                $badgeClass = $rowStatus === 'active' ? 'badge-sub-active' : 'badge-sub-unsubscribed';
                $name = trim(((string) ($row['first_name'] ?? '')) . ' ' . ((string) ($row['last_name'] ?? '')));
                ?>
                <tr>
                    <td><?= esc((string) $row['email']) ?></td>
                    <td><?= $name !== '' ? esc($name) : '—' ?></td>
                    <td><span class="badge <?= esc($badgeClass, 'attr') ?>"><?= esc($rowStatus) ?></span></td>
                    <td><?= esc(implode(', ', $row['categories'] ?? [])) ?></td>
                    <td><?= esc((string) ($row['consented_at'] ?? '')) ?></td>
                    <td class="table-actions">
                        <?php if ($rowStatus === 'active'): ?>
                            <form class="inline-form" method="post" action="<?= site_url('admin/subscribers/' . $row['id'] . '/unsubscribe') ?>" onsubmit="return confirm('Mark this subscriber as unsubscribed? They will stop receiving future alerts.');">
                                <?= csrf_field() ?>
                                <button type="submit" class="btn btn-danger">Unsubscribe</button>
                            </form>
                        <?php endif; ?>
                    </td>
                </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
</div>
<?php endif; ?>
<?= $this->endSection() ?>
