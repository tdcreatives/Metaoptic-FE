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
