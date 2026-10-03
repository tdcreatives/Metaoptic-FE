<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title><?= esc($title) ?></title>
    <link rel="stylesheet" href="<?= esc(base_url('css/admin.css'), 'attr') ?>">
</head>
<?php
$uri = (string) uri_string();
$isLogin = str_contains($uri, 'admin/login');
$navClass = static function (string $prefix) use ($uri): string {
    $active = $prefix === 'admin'
        ? ($uri === 'admin' || $uri === 'admin/')
        : str_starts_with($uri, $prefix);
    return $active ? 'is-active' : '';
};
?>
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
            <a class="<?= esc($navClass('admin'), 'attr') ?>" href="<?= site_url('admin') ?>">Dashboard</a>
            <a class="<?= esc($navClass('admin/announcements'), 'attr') ?>" href="<?= site_url('admin/announcements') ?>">Announcements</a>
            <a class="<?= esc($navClass('admin/email-alerts'), 'attr') ?>" href="<?= site_url('admin/email-alerts') ?>">Email Alerts</a>
            <a class="<?= esc($navClass('admin/subscribers'), 'attr') ?>" href="<?= site_url('admin/subscribers') ?>">Subscribers</a>
            <a class="<?= esc($navClass('admin/sync-runs'), 'attr') ?>" href="<?= site_url('admin/sync-runs') ?>">Sync history</a>
            <a class="<?= esc($navClass('admin/settings'), 'attr') ?>" href="<?= site_url('admin/settings/recipients') ?>">Settings</a>
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
