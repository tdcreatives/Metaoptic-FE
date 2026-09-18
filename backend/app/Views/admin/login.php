<?= $this->extend('admin/layout') ?>
<?= $this->section('content') ?>
<h1><?= esc($title) ?></h1>
<?php if (session('error')): ?>
<p><?= esc((string) session('error')) ?></p>
<?php endif; ?>
<form method="post" action="<?= site_url('admin/login') ?>">
    <?= csrf_field() ?>
    <label>Username <input name="username" autocomplete="username"></label>
    <label>Password <input name="password" type="password" autocomplete="current-password"></label>
    <button type="submit">Login</button>
</form>
<?= $this->endSection() ?>
