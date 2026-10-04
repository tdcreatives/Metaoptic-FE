<?= $this->extend('admin/layout') ?>
<?= $this->section('content') ?>
<div class="card login-card">
    <h1><?= esc($title) ?></h1>
    <aside class="page-guide" aria-label="Login tip">
        <span class="page-guide-label">Tip</span>
        <p>Internal MetaOptics CMS for IR announcements, email alerts, and SGX sync. Use the credentials provided by your administrator.</p>
    </aside>
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
