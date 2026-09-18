<?= $this->extend('admin/layout') ?>
<?= $this->section('content') ?>
<h1><?= esc($title) ?></h1>
<ul>
    <li>Pending <?= esc((string) $pending) ?></li>
    <li>Published <?= esc((string) $published) ?></li>
    <li>Needs review <?= esc((string) $needs_review) ?></li>
</ul>
<form method="post" action="<?= site_url('admin/logout') ?>">
    <?= csrf_field() ?>
    <button type="submit">Logout</button>
</form>
<?= $this->endSection() ?>
