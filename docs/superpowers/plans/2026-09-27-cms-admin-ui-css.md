# CMS Admin UI CSS Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give the CI4 IR admin a shadcn-like UI with MetaOptics accent (`#D44C39`), and make `GET /` always redirect to `/admin` so opening the backend app never shows the CI welcome page.

**Architecture:** Keep server-rendered PHP views under `/admin/*`. One static stylesheet `backend/public/css/admin.css` plus a shared `admin/layout.php` shell (header/nav/logout). Content views only gain semantic CSS classes and light markup wrappers — no React, no Tailwind, no route rename to `/backend`. Auth stays `AdminAuthFilter` → `/admin/login`.

**Tech Stack:** CodeIgniter 4.7+, PHP 8.2+, PHPUnit FeatureTestTrait, plain CSS (no build step).

## Global Constraints

- Spec: `docs/superpowers/designs/2026-09-27-cms-admin-ui-css.md`
- Stay in CI4 PHP views; do **not** introduce React/shadcn components or Tailwind CDN/build.
- Keep routes under `/admin/*`; do **not** rename to `/backend`.
- Do **not** change Publish/Send/Archive/CSRF/session/login rate-limit business logic.
- Do **not** flip FE flags (`showEmailAlerts`, `useAnnouncementsApi`).
- Primary accent: `#D44C39`; primary color only on primary CTAs (not entire chrome).
- CSS-only components: `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-danger`, `.card`, `.table`, `.badge`, `.form-group`, `.input`, `.label`, `.flash`, `.flash-error`, `.flash-success`.
- Prefer zero new JavaScript.
- After code changes: `graphify update .` (AST-only).

---

## File Structure

```text
backend/
  public/css/admin.css                          # NEW — tokens + components
  app/Controllers/Home.php                      # MODIFY — redirect to /admin
  app/Views/admin/layout.php                    # MODIFY — CSS link, shell, nav
  app/Views/admin/login.php                     # MODIFY — card form classes
  app/Views/admin/dashboard.php                 # MODIFY — cards; drop duplicate nav/logout
  app/Views/admin/announcements/index.php       # MODIFY — table/badge/empty
  app/Views/admin/announcements/show.php        # MODIFY — cards + button classes
  app/Views/admin/sync_runs/index.php           # MODIFY — table; drop duplicate nav
  app/Views/admin/settings/recipients.php       # MODIFY — form/table; drop duplicate nav
  tests/feature/Admin/HomeRedirectTest.php      # NEW — GET / → /admin
  tests/feature/Admin/AdminLayoutTest.php       # NEW — CSS + chrome on login/dashboard
```

---

### Task 1: Root redirect `/` → `/admin`

**Files:**
- Modify: `backend/app/Controllers/Home.php`
- Create: `backend/tests/feature/Admin/HomeRedirectTest.php`

**Interfaces:**
- Consumes: CI4 `redirect()->to('/admin')`
- Produces: `Home::index(): RedirectResponse` (no longer returns `welcome_message`)

- [ ] **Step 1: Write the failing test**

```php
<?php
declare(strict_types=1);

namespace Tests\Feature\Admin;

use CodeIgniter\Test\CIUnitTestCase;
use CodeIgniter\Test\FeatureTestTrait;

final class HomeRedirectTest extends CIUnitTestCase
{
    use FeatureTestTrait;

    public function test_root_redirects_to_admin(): void
    {
        $this->get('/')->assertRedirectTo('/admin');
    }
}
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd backend && ./vendor/bin/phpunit --no-coverage tests/feature/Admin/HomeRedirectTest.php`

Expected: FAIL (root still returns 200 welcome page, or assertRedirectTo fails).

- [ ] **Step 3: Implement redirect**

Replace `backend/app/Controllers/Home.php` with:

```php
<?php

namespace App\Controllers;

use CodeIgniter\HTTP\RedirectResponse;

class Home extends BaseController
{
    public function index(): RedirectResponse
    {
        return redirect()->to('/admin');
    }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd backend && ./vendor/bin/phpunit --no-coverage tests/feature/Admin/HomeRedirectTest.php`

Expected: OK (1 test). Unauthenticated follow of `/admin` still redirects to `/admin/login` via existing filter (covered by `AdminAuthTest`).

- [ ] **Step 5: Commit**

```bash
git add backend/app/Controllers/Home.php backend/tests/feature/Admin/HomeRedirectTest.php
git commit -m "feat(cms): redirect CI4 root to /admin"
```

---

### Task 2: `admin.css` tokens + layout shell

**Files:**
- Create: `backend/public/css/admin.css`
- Modify: `backend/app/Views/admin/layout.php`
- Create: `backend/tests/feature/Admin/AdminLayoutTest.php`

**Interfaces:**
- Consumes: `base_url('css/admin.css')`, `csrf_field()`, `site_url(...)`, `uri_string()`
- Produces: Shared chrome — header “MetaOptics IR Admin”, nav links, logout POST; login path hides nav/logout (`str_contains(uri_string(), 'admin/login')`)

- [ ] **Step 1: Write the failing layout test**

```php
<?php
declare(strict_types=1);

namespace Tests\Feature\Admin;

use CodeIgniter\Config\Factories;
use CodeIgniter\Test\CIUnitTestCase;
use CodeIgniter\Test\DatabaseTestTrait;
use CodeIgniter\Test\FeatureTestTrait;
use Config\Admin;

final class AdminLayoutTest extends CIUnitTestCase
{
    use DatabaseTestTrait;
    use FeatureTestTrait;

    protected $migrate = true;
    protected $refresh = true;
    protected $namespace = 'App';

    protected function setUp(): void
    {
        parent::setUp();
        $hash = password_hash('test-admin-pass', PASSWORD_DEFAULT);
        $_ENV['admin.username'] = 'ir-admin';
        $_ENV['admin.passwordHash'] = $hash;
        putenv('admin.username=ir-admin');
        putenv('admin.passwordHash=' . $hash);
        $cfg = new Admin();
        Factories::injectMock('config', Admin::class, $cfg);
        Factories::injectMock('config', 'Admin', $cfg);
    }

    protected function tearDown(): void
    {
        putenv('admin.username');
        putenv('admin.passwordHash');
        unset($_ENV['admin.username'], $_ENV['admin.passwordHash']);
        parent::tearDown();
    }

    public function test_login_page_links_admin_css_and_hides_nav(): void
    {
        $result = $this->get('/admin/login');
        $result->assertOK();
        $result->assertSee('css/admin.css', true);
        $result->assertSee('MetaOptics IR Admin', true);
        $result->assertDontSee('Sync history', true);
    }

    public function test_dashboard_shows_nav_and_css(): void
    {
        $result = $this->withSession(['admin' => true])->get('/admin');
        $result->assertOK();
        $result->assertSee('css/admin.css', true);
        $result->assertSee('MetaOptics IR Admin', true);
        $result->assertSee('Announcements', true);
        $result->assertSee('Sync history', true);
        $result->assertSee('Settings', true);
        $result->assertSee('Logout', true);
    }
}
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd backend && ./vendor/bin/phpunit --no-coverage tests/feature/Admin/AdminLayoutTest.php`

Expected: FAIL (no `css/admin.css` / chrome text).

- [ ] **Step 3: Create `backend/public/css/admin.css`**

```css
:root {
  --background: #fafafa;
  --foreground: #18181b;
  --muted: #f4f4f5;
  --muted-foreground: #71717a;
  --border: #e4e4e7;
  --card: #ffffff;
  --primary: #d44c39;
  --primary-foreground: #ffffff;
  --danger: #b91c1c;
  --radius: 0.5rem;
  --font: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
}

*,
*::before,
*::after { box-sizing: border-box; }

body {
  margin: 0;
  font-family: var(--font);
  color: var(--foreground);
  background: var(--background);
  line-height: 1.5;
}

a { color: var(--foreground); }
a:hover { color: var(--primary); }

.admin-shell { min-height: 100vh; display: flex; flex-direction: column; }

.admin-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.75rem 1.25rem;
  border-bottom: 1px solid var(--border);
  background: var(--card);
}

.admin-brand {
  font-weight: 600;
  text-decoration: none;
  letter-spacing: -0.01em;
}

.admin-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 1rem;
  align-items: center;
}

.admin-nav a {
  text-decoration: none;
  color: var(--muted-foreground);
  font-size: 0.875rem;
}

.admin-nav a:hover,
.admin-nav a.is-active { color: var(--foreground); }

.admin-main {
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 1.5rem 1.25rem 3rem;
}

.admin-main h1 {
  margin: 0 0 1rem;
  font-size: 1.5rem;
  letter-spacing: -0.02em;
}

.admin-main h2 {
  margin: 1.5rem 0 0.75rem;
  font-size: 1.125rem;
}

.login-wrap {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}

.login-card {
  width: 100%;
  max-width: 400px;
}

.card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1.25rem;
}

.card + .card { margin-top: 1rem; }

.stat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 0.75rem;
  margin-bottom: 1.25rem;
}

.stat-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1rem;
}

.stat-card .label {
  display: block;
  font-size: 0.75rem;
  color: var(--muted-foreground);
  margin-bottom: 0.25rem;
}

.stat-card .value {
  font-size: 1.5rem;
  font-weight: 600;
}

.flash {
  border-radius: var(--radius);
  padding: 0.75rem 1rem;
  margin-bottom: 1rem;
  border: 1px solid var(--border);
  background: var(--muted);
}

.flash-error {
  border-color: #fecaca;
  background: #fef2f2;
  color: var(--danger);
}

.flash-success {
  border-color: #bbf7d0;
  background: #f0fdf4;
  color: #166534;
}

.form-group { margin-bottom: 0.875rem; }

.label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.35rem;
}

.input,
textarea.input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--border);
  border-radius: calc(var(--radius) - 2px);
  background: var(--card);
  color: var(--foreground);
  font: inherit;
}

textarea.input { min-height: 6rem; resize: vertical; }

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  padding: 0.5rem 0.875rem;
  border-radius: calc(var(--radius) - 2px);
  border: 1px solid var(--border);
  background: var(--card);
  color: var(--foreground);
  font: inherit;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
}

.btn:hover { background: var(--muted); }
.btn:disabled { opacity: 0.5; cursor: not-allowed; }

.btn-primary {
  background: var(--primary);
  border-color: var(--primary);
  color: var(--primary-foreground);
}

.btn-primary:hover { filter: brightness(0.95); background: var(--primary); }

.btn-secondary { background: var(--card); }

.btn-danger {
  background: var(--card);
  border-color: #fecaca;
  color: var(--danger);
}

.btn-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
}

.table-wrap { overflow-x: auto; border: 1px solid var(--border); border-radius: var(--radius); background: var(--card); }

.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.table th,
.table td {
  padding: 0.65rem 0.75rem;
  border-bottom: 1px solid var(--border);
  text-align: left;
  vertical-align: top;
}

.table th {
  background: var(--muted);
  font-weight: 500;
  color: var(--muted-foreground);
}

.table tr:last-child td { border-bottom: 0; }
.table tr:hover td { background: #fcfcfc; }

.table td a {
  text-decoration: none;
  font-weight: 500;
}

.badge {
  display: inline-block;
  padding: 0.125rem 0.5rem;
  border-radius: 999px;
  font-size: 0.75rem;
  background: var(--muted);
  color: var(--muted-foreground);
  border: 1px solid var(--border);
  white-space: nowrap;
}

.filter-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
}

.filter-row a { color: var(--muted-foreground); text-decoration: none; }
.filter-row a:hover { color: var(--primary); }

.empty {
  color: var(--muted-foreground);
  font-size: 0.875rem;
  padding: 1rem 0;
}

.meta-list {
  margin: 0 0 1rem;
  padding: 0;
  list-style: none;
  font-size: 0.875rem;
}

.meta-list li { margin-bottom: 0.35rem; color: var(--muted-foreground); }
.meta-list strong { color: var(--foreground); font-weight: 500; }

.pre-block {
  overflow-x: auto;
  padding: 0.75rem;
  background: var(--muted);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  font-size: 0.75rem;
}

.inline-form { display: inline; }
```

- [ ] **Step 4: Replace `backend/app/Views/admin/layout.php`**

```php
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
        <?= $this->renderSection('content') ?>
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
```

- [ ] **Step 5: Run layout tests**

Run: `cd backend && ./vendor/bin/phpunit --no-coverage tests/feature/Admin/AdminLayoutTest.php`

Expected: OK (2 tests).

- [ ] **Step 6: Commit**

```bash
git add backend/public/css/admin.css backend/app/Views/admin/layout.php backend/tests/feature/Admin/AdminLayoutTest.php
git commit -m "feat(cms): admin.css tokens and shared layout shell"
```

---

### Task 3: Login + dashboard views

**Files:**
- Modify: `backend/app/Views/admin/login.php`
- Modify: `backend/app/Views/admin/dashboard.php`

**Interfaces:**
- Consumes: layout shell from Task 2; dashboard vars `$pending`, `$published`, `$needs_review`, `$title`
- Produces: Login card markup; dashboard stat cards; **no** duplicate logout/nav on dashboard (chrome is in layout)

- [ ] **Step 1: Replace `login.php`**

```php
<?= $this->extend('admin/layout') ?>
<?= $this->section('content') ?>
<div class="card login-card">
    <p class="admin-brand" style="margin:0 0 0.25rem">MetaOptics IR Admin</p>
    <h1><?= esc($title) ?></h1>
    <?php if (session('error')): ?>
        <div class="flash flash-error"><?= esc((string) session('error')) ?></div>
    <?php endif; ?>
    <form method="post" action="<?= site_url('admin/login') ?>">
        <?= csrf_field() ?>
        <div class="form-group">
            <label class="label" for="username">Username</label>
            <input class="input" id="username" name="username" autocomplete="username">
        </div>
        <div class="form-group">
            <label class="label" for="password">Password</label>
            <input class="input" id="password" name="password" type="password" autocomplete="current-password">
        </div>
        <button class="btn btn-primary" type="submit">Login</button>
    </form>
</div>
<?= $this->endSection() ?>
```

- [ ] **Step 2: Replace `dashboard.php`**

```php
<?= $this->extend('admin/layout') ?>
<?= $this->section('content') ?>
<h1><?= esc($title) ?></h1>
<div class="stat-grid">
    <div class="stat-card">
        <span class="label">Pending</span>
        <span class="value"><?= esc((string) $pending) ?></span>
    </div>
    <div class="stat-card">
        <span class="label">Published</span>
        <span class="value"><?= esc((string) $published) ?></span>
    </div>
    <div class="stat-card">
        <span class="label">Needs review</span>
        <span class="value"><?= esc((string) $needs_review) ?></span>
    </div>
</div>
<p class="btn-row">
    <a class="btn btn-primary" href="<?= site_url('admin/announcements') ?>">Announcements</a>
    <a class="btn btn-secondary" href="<?= site_url('admin/sync-runs') ?>">Sync history</a>
    <a class="btn btn-secondary" href="<?= site_url('admin/settings/recipients') ?>">Settings</a>
</p>
<?= $this->endSection() ?>
```

- [ ] **Step 3: Run auth + layout tests**

Run: `cd backend && ./vendor/bin/phpunit --no-coverage tests/feature/Admin/AdminAuthTest.php tests/feature/Admin/AdminLayoutTest.php`

Expected: OK. Dashboard still shows Pending/Published/Needs review counts (existing asserts).

- [ ] **Step 4: Commit**

```bash
git add backend/app/Views/admin/login.php backend/app/Views/admin/dashboard.php
git commit -m "feat(cms): polish login and dashboard views"
```

---

### Task 4: Announcements list + detail

**Files:**
- Modify: `backend/app/Views/admin/announcements/index.php`
- Modify: `backend/app/Views/admin/announcements/show.php`

**Interfaces:**
- Consumes: `$announcements`, `$row`, `$sourcePretty`, `$title`; existing form field names and disabled rules for Publish/Send
- Produces: `.table` / `.badge` / empty state; detail cards; button classes only — **same** `name=` / actions / `disabled` logic

- [ ] **Step 1: Replace `announcements/index.php`**

```php
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
```

- [ ] **Step 2: Replace `announcements/show.php`**

```php
<?= $this->extend('admin/layout') ?>
<?= $this->section('content') ?>
<p><a href="<?= site_url('admin/announcements') ?>">← Back to list</a></p>
<h1><?= esc($title) ?></h1>
<?php if (session('message')): ?>
    <div class="flash flash-success"><?= esc((string) session('message')) ?></div>
<?php endif; ?>
<?php if (session('error')): ?>
    <div class="flash flash-error"><?= esc((string) session('error')) ?></div>
<?php endif; ?>

<div class="card">
    <ul class="meta-list">
        <li><strong>State:</strong> <span class="badge"><?= esc($row['state']) ?></span></li>
        <li><strong>Category:</strong> <?= esc($row['category']) ?></li>
        <li><strong>Issuer:</strong> <?= esc($row['issuer']) ?></li>
        <li><strong>Filed:</strong> <?= esc((string) $row['filed_at']) ?></li>
        <li><strong>Source:</strong> <a href="<?= esc($row['source_url'], 'attr') ?>"><?= esc($row['source_url']) ?></a></li>
    </ul>
</div>

<div class="card">
    <form method="post" action="<?= site_url('admin/announcements/' . $row['id'] . '/summary') ?>">
        <?= csrf_field() ?>
        <div class="form-group">
            <label class="label" for="summary">Summary</label>
            <textarea class="input" id="summary" name="summary"><?= esc($row['summary'] ?? '') ?></textarea>
        </div>
        <div class="form-group">
            <label class="label" for="email_subject">Email subject</label>
            <input class="input" id="email_subject" type="text" name="email_subject" value="<?= esc($row['email_subject'] ?? '') ?>">
        </div>
        <div class="form-group">
            <label class="label" for="email_intro">Email intro</label>
            <textarea class="input" id="email_intro" name="email_intro"><?= esc($row['email_intro'] ?? '') ?></textarea>
        </div>
        <button class="btn btn-primary" type="submit">Save</button>
    </form>
</div>

<div class="card">
    <h2>Actions</h2>
    <div class="btn-row">
        <form method="post" action="<?= site_url('admin/announcements/' . $row['id'] . '/publish') ?>">
            <?= csrf_field() ?>
            <button class="btn btn-primary" type="submit" <?= $row['state'] === 'published' ? 'disabled' : '' ?>>Publish</button>
        </form>
        <form method="post" action="<?= site_url('admin/announcements/' . $row['id'] . '/send') ?>">
            <?= csrf_field() ?>
            <button class="btn btn-secondary" type="submit" <?= $row['state'] === 'published' ? '' : 'disabled' ?>>Send</button>
        </form>
        <form method="post" action="<?= site_url('admin/announcements/' . $row['id'] . '/archive') ?>">
            <?= csrf_field() ?>
            <button class="btn btn-danger" type="submit">Archive</button>
        </form>
    </div>
</div>

<div class="card">
    <h2>Source payload</h2>
    <pre class="pre-block"><?= esc($sourcePretty) ?></pre>
</div>
<?= $this->endSection() ?>
```

- [ ] **Step 3: Run announcement feature tests**

Run: `cd backend && ./vendor/bin/phpunit --no-coverage tests/feature/Admin/AnnouncementEditTest.php tests/feature/Admin/AdminPublishSendTest.php`

Expected: OK (no logic regressions).

- [ ] **Step 4: Commit**

```bash
git add backend/app/Views/admin/announcements/index.php backend/app/Views/admin/announcements/show.php
git commit -m "feat(cms): polish announcements list and detail views"
```

---

### Task 5: Sync history + settings recipients

**Files:**
- Modify: `backend/app/Views/admin/sync_runs/index.php`
- Modify: `backend/app/Views/admin/settings/recipients.php`

**Interfaces:**
- Consumes: `$runs`, `$recipients`, `$title`; existing POST shapes for add/deactivate recipients
- Produces: Polished tables/forms; **remove** per-page duplicate nav links (layout owns nav)

- [ ] **Step 1: Replace `sync_runs/index.php`**

```php
<?= $this->extend('admin/layout') ?>
<?= $this->section('content') ?>
<h1><?= esc($title) ?></h1>
<?php if ($runs === [] || count($runs) === 0): ?>
    <p class="empty">No sync runs</p>
<?php else: ?>
<div class="table-wrap">
    <table class="table">
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
                    <td><span class="badge"><?= esc($row['status']) ?></span></td>
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
</div>
<?php endif; ?>
<?= $this->endSection() ?>
```

- [ ] **Step 2: Replace `settings/recipients.php`**

```php
<?= $this->extend('admin/layout') ?>
<?= $this->section('content') ?>
<h1><?= esc($title) ?></h1>
<?php if (session('message')): ?>
    <div class="flash flash-success"><?= esc((string) session('message')) ?></div>
<?php endif; ?>
<?php if (session('error')): ?>
    <div class="flash flash-error"><?= esc((string) session('error')) ?></div>
<?php endif; ?>

<div class="card">
    <form method="post" action="<?= site_url('admin/settings/recipients') ?>">
        <?= csrf_field() ?>
        <div class="form-group">
            <label class="label" for="email">Email</label>
            <input class="input" id="email" type="email" name="email" required>
        </div>
        <button class="btn btn-primary" type="submit">Add</button>
    </form>
</div>

<?php if ($recipients === [] || count($recipients) === 0): ?>
    <p class="empty">No recipients</p>
<?php else: ?>
<div class="table-wrap" style="margin-top:1rem">
    <table class="table">
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
                                <button class="btn btn-danger" type="submit">Deactivate</button>
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
```

- [ ] **Step 3: Run related admin tests**

Run: `cd backend && ./vendor/bin/phpunit --no-coverage tests/feature/Admin/`

Expected: OK (all Admin feature tests).

- [ ] **Step 4: Commit**

```bash
git add backend/app/Views/admin/sync_runs/index.php backend/app/Views/admin/settings/recipients.php
git commit -m "feat(cms): polish sync history and recipients settings views"
```

---

### Task 6: Regression + graphify

**Files:**
- None new (verify only); optionally touch nothing if green

**Interfaces:**
- Consumes: Tasks 1–5 complete
- Produces: Confirmation that admin suite + new tests pass; graphify updated

- [ ] **Step 1: Run focused suites**

```bash
cd backend && ./vendor/bin/phpunit --no-coverage \
  tests/feature/Admin/HomeRedirectTest.php \
  tests/feature/Admin/AdminLayoutTest.php \
  tests/feature/Admin/AdminAuthTest.php \
  tests/feature/Admin/AnnouncementEditTest.php \
  tests/feature/Admin/AdminPublishSendTest.php
```

Expected: OK.

- [ ] **Step 2: Manual spot-check (checklist, not automated)**

- Open CI4 app `/` → lands on `/admin` → `/admin/login` if logged out  
- Login → dashboard stats + nav  
- Announcements list/detail → Save / Publish disabled rules still work  
- Sync history + Settings recipients add/deactivate  

- [ ] **Step 3: Update graphify**

```bash
cd /Users/nktam/Projects/Metaoptic-FE && graphify update .
```

- [ ] **Step 4: Commit only if graphify or leftover fixes exist**

```bash
# only if there are tracked changes from fixes
git status
# if needed:
# git add -u && git commit -m "chore(cms): graphify after admin UI polish"
```

If working tree clean after Step 3, skip commit.

---

## Self-Review

1. **Spec coverage:** Root redirect → Task 1. Shared CSS + shell → Task 2. All screens (login, dashboard, announcements list/detail, sync, settings) → Tasks 3–5. Testing + graphify → Tasks 1–2 tests + Task 6. Non-goals (no `/backend` rename, no React, no FE flags, no logic change) respected.
2. **Placeholder scan:** No TBD/TODO; full CSS and view markup included.
3. **Consistency:** Class names match Global Constraints; Publish/Send `disabled` rules unchanged; form field names unchanged; nav label “Sync history” matches design (route still `admin/sync-runs`).

---

**Plan complete and saved to `docs/superpowers/plans/2026-09-27-cms-admin-ui-css.md`. Two execution options:**

**1. Subagent-Driven (recommended)** — fresh subagent per task, review between tasks  

**2. Inline Execution** — execute in this session with executing-plans checkpoints  

**Which approach?**
