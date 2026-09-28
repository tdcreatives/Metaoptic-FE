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
        <li><strong>Source:</strong> <span class="badge"><?= esc((string) ($row['source'] ?? 'sgx')) ?></span></li>
        <li><strong>State:</strong> <span class="badge"><?= esc($row['state']) ?></span></li>
        <li><strong>Category:</strong> <?= esc($row['category']) ?></li>
        <li><strong>Issuer:</strong> <?= esc($row['issuer']) ?></li>
        <li><strong>Filed:</strong> <?= esc((string) $row['filed_at']) ?></li>
        <li><strong>Source URL:</strong> <a href="<?= esc($row['source_url'], 'attr') ?>"><?= esc($row['source_url']) ?></a></li>
    </ul>
</div>

<div class="card">
    <form method="post" action="<?= site_url('admin/announcements/' . $row['id'] . '/summary') ?>">
        <?= csrf_field() ?>
        <div class="form-group">
            <label class="label" for="summary">Summary</label>
            <textarea class="input" id="summary" name="summary"><?= esc($row['summary'] ?? '') ?></textarea>
        </div>
        <button class="btn btn-primary" type="submit">Save</button>
    </form>
</div>

<div class="card">
    <h2>Layout overrides</h2>
    <form method="post" action="<?= site_url('admin/announcements/' . $row['id'] . '/layout') ?>">
        <?= csrf_field() ?>
        <div class="form-group">
            <label class="label" for="title_btn">title_btn</label>
            <input class="input" id="title_btn" type="text" name="title_btn" value="<?= esc((string) ($row['title_btn'] ?? '')) ?>">
        </div>
        <div class="form-group">
            <label class="label" for="title_btn_sm">title_btn_sm</label>
            <input class="input" id="title_btn_sm" type="text" name="title_btn_sm" value="<?= esc((string) ($row['title_btn_sm'] ?? '')) ?>">
        </div>
        <div class="form-group">
            <label class="label" for="title_banner">title_banner</label>
            <input class="input" id="title_banner" type="text" name="title_banner" value="<?= esc((string) ($row['title_banner'] ?? '')) ?>">
        </div>
        <button class="btn btn-primary" type="submit">Save layout</button>
    </form>
</div>

<div class="card">
    <h2>Actions</h2>
    <div class="btn-row">
        <form method="post" action="<?= site_url('admin/announcements/' . $row['id'] . '/publish') ?>">
            <?= csrf_field() ?>
            <button class="btn btn-primary" type="submit" <?= $row['state'] === 'published' ? 'disabled' : '' ?>>Publish</button>
        </form>
        <form method="post" action="<?= site_url('admin/announcements/' . $row['id'] . '/archive') ?>">
            <?= csrf_field() ?>
            <button class="btn btn-danger" type="submit">Archive</button>
        </form>
        <form method="post" action="<?= site_url('admin/announcements/' . $row['id'] . '/delete') ?>">
            <?= csrf_field() ?>
            <button class="btn btn-danger" type="submit">Delete</button>
        </form>
        <?php if (($row['state'] ?? '') === 'published'): ?>
            <a class="btn btn-secondary" href="<?= site_url('admin/email-alerts/new?announcement_id=' . $row['id']) ?>">Create Email Alert with this</a>
        <?php endif; ?>
    </div>
</div>

<div class="card">
    <h2>Source payload</h2>
    <pre class="pre-block"><?= esc($sourcePretty) ?></pre>
</div>

<?php if (! empty($offerAlert)): ?>
<dialog class="card" open>
    <p>Create Email Alert draft for this announcement?</p>
    <div class="btn-row">
        <form method="post" action="<?= site_url('admin/announcements/' . $row['id'] . '/create-alert-draft') ?>">
            <?= csrf_field() ?>
            <button class="btn btn-primary" type="submit">Yes</button>
        </form>
        <a class="btn btn-secondary" href="<?= site_url('admin/announcements/' . $row['id']) ?>">No</a>
    </div>
</dialog>
<?php endif; ?>
<?= $this->endSection() ?>
