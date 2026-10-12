<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title><?= esc($title ?? 'MetaOptics Admin') ?></title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
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
    $crumb = (string) ($title ?? 'Admin');
    $navPending = 0;
    $navSubsActive = 0;
    if (! $isLogin) {
        try {
            $navPending = (int) db_connect()->table('announcements')
                ->where('state', 'pending_review')
                ->countAllResults();
            $navSubsActive = (int) db_connect()->table('subscribers')
                ->where('status', 'active')
                ->countAllResults();
        } catch (Throwable) {
            // ponytail: layout must render even if DB is briefly unavailable
        }
    }
    $searchQ = (string) (service('request')->getGet('q') ?? '');
?>
<body class="<?= $isLogin ? 'login-body' : 'admin-shell' ?>">
<?php if ($isLogin): ?>
    <div class="login-wrap">
        <main class="login-panel">
            <p class="admin-brand">MetaOptics Admin</p>
            <?= $this->renderSection('content') ?>
        </main>
    </div>
<?php else: ?>
    <div class="app" id="admin-app">
        <div class="side-backdrop" data-side-close hidden></div>
        <aside class="side" id="admin-side" aria-label="Admin navigation">
            <div class="brand">
                <a href="<?= site_url('admin') ?>">
                    <img class="logo" src="<?= esc(base_url('img/logo.svg'), 'attr') ?>" alt="MetaOptics">
                </a>
                <span class="brand-sub">Investor Relations</span>
            </div>

            <a class="nav-item <?= esc($navClass('admin'), 'attr') ?>" href="<?= site_url('admin') ?>">
                <svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg>
                Dashboard
            </a>

            <div class="nav-label">Publishing</div>
            <a class="nav-item <?= esc($navClass('admin/announcements'), 'attr') ?>" href="<?= site_url('admin/announcements') ?>">
                <svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h10"/></svg>
                Announcements
                <?php if ($navPending > 0): ?>
                    <span class="nav-badge amber" title="Needs review"><?= esc((string) $navPending) ?></span>
                <?php endif; ?>
            </a>
            <a class="nav-item <?= esc($navClass('admin/sync-runs'), 'attr') ?>" href="<?= site_url('admin/sync-runs') ?>">
                <svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 12a9 9 0 11-3-6.7L21 8"/><path d="M21 3v5h-5"/></svg>
                Sync history
            </a>

            <div class="nav-label">Investor Emails</div>
            <a class="nav-item <?= esc($navClass('admin/email-alerts'), 'attr') ?>" href="<?= site_url('admin/email-alerts') ?>">
                <svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>
                Email Alerts
            </a>
            <a class="nav-item <?= esc($navClass('admin/subscribers'), 'attr') ?>" href="<?= site_url('admin/subscribers') ?>">
                <svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 00-3-3.87"/></svg>
                Subscribers
                <?php if ($navSubsActive > 0): ?>
                    <span class="nav-badge"><?= esc((string) $navSubsActive) ?></span>
                <?php endif; ?>
            </a>

            <div class="side-foot">
                <a class="nav-item <?= esc($navClass('admin/settings'), 'attr') ?>" href="<?= site_url('admin/settings/recipients') ?>">
                    <svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l-.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
                    Settings
                </a>
                <form class="side-logout" method="post" action="<?= site_url('admin/logout') ?>">
                    <?= csrf_field() ?>
                    <button class="nav-item nav-item-btn" type="submit">
                        <svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>
                        Logout
                    </button>
                </form>
            </div>
        </aside>

        <div class="main">
            <header class="topbar">
                <button type="button" class="side-toggle" data-side-toggle aria-controls="admin-side" aria-expanded="false" aria-label="Open menu">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
                </button>
                <div class="crumb"><b><?= esc($crumb) ?></b></div>
                <div class="spacer"></div>
                <form class="top-search" method="get" action="<?= site_url('admin/announcements') ?>" role="search">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/></svg>
                    <input type="search" name="q" value="<?= esc($searchQ, 'attr') ?>" placeholder="Search announcements…" aria-label="Search announcements">
                </form>
                <div class="avatar" title="IR Admin" aria-hidden="true">IR</div>
            </header>
            <main class="admin-main content">
                <?= $this->renderSection('content') ?>
            </main>
        </div>
    </div>
    <script src="<?= esc(base_url('js/admin-shell.js'), 'attr') ?>" defer></script>
<?php endif; ?>
</body>
</html>
