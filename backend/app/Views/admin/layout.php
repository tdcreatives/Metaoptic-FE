<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title><?= esc($title) ?></title>
    <link rel="stylesheet" href="<?= esc(base_url('css/admin.css'), 'attr') ?>">
</head>
<?php $isLogin = str_contains((string) uri_string(), 'admin/login'); ?>
<body class="<?= $isLogin ? 'login-body' : 'admin-shell' ?>">
<?php if ($isLogin): ?>
    <div class="login-wrap">
        <main class="login-panel">
            <p class="admin-brand">MetaOptics IR Admin</p>
            <?= $this->renderSection('content') ?>
        </main>
    </div>
<?php else: ?>
    <header class="admin-header">
        <a class="admin-brand" href="<?= site_url('admin') ?>">MetaOptics IR Admin</a>
        <nav class="admin-nav" aria-label="Admin">
            <a href="<?= site_url('admin') ?>">Dashboard</a>
            <a href="<?= site_url('admin/announcements') ?>">Announcements</a>
            <a href="<?= site_url('admin/sync-runs') ?>">Sync history</a>
            <a href="<?= site_url('admin/settings/recipients') ?>">Settings</a>
            <form class="inline-form" method="post" action="<?= site_url('admin/logout') ?>">
                <?= csrf_field() ?>
                <button class="btn btn-secondary" type="submit">Logout</button>
            </form>
        </nav>
    </header>
    <main class="admin-main">
        <?= $this->renderSection('content') ?>
    </main>
<?php endif; ?>
</body>
</html>
