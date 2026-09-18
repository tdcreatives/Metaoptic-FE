<?= $this->extend('admin/layout') ?>
<?= $this->section('content') ?>
<p><a href="<?= site_url('admin/announcements') ?>">Back to list</a></p>
<h1><?= esc($title) ?></h1>
<?php if (session('message')): ?>
    <p><?= esc((string) session('message')) ?></p>
<?php endif; ?>
<?php if (session('error')): ?>
    <p><?= esc((string) session('error')) ?></p>
<?php endif; ?>
<p>State: <?= esc($row['state']) ?></p>
<p>Category: <?= esc($row['category']) ?></p>
<p>Issuer: <?= esc($row['issuer']) ?></p>
<p>Filed: <?= esc((string) $row['filed_at']) ?></p>
<p>Source: <a href="<?= esc($row['source_url'], 'attr') ?>"><?= esc($row['source_url']) ?></a></p>

<form method="post" action="<?= site_url('admin/announcements/' . $row['id'] . '/summary') ?>">
    <?= csrf_field() ?>
    <p>
        <label>Summary
            <textarea name="summary"><?= esc($row['summary'] ?? '') ?></textarea>
        </label>
    </p>
    <p>
        <label>Email subject
            <input type="text" name="email_subject" value="<?= esc($row['email_subject'] ?? '') ?>">
        </label>
    </p>
    <p>
        <label>Email intro
            <textarea name="email_intro"><?= esc($row['email_intro'] ?? '') ?></textarea>
        </label>
    </p>
    <button type="submit">Save</button>
</form>

<h2>Source payload</h2>
<pre><?= esc($sourcePretty) ?></pre>

<form method="post" action="<?= site_url('admin/announcements/' . $row['id'] . '/publish') ?>">
    <?= csrf_field() ?>
    <button type="submit" <?= $row['state'] === 'published' ? 'disabled' : '' ?>>Publish</button>
</form>
<form method="post" action="<?= site_url('admin/announcements/' . $row['id'] . '/send') ?>">
    <?= csrf_field() ?>
    <button type="submit" <?= $row['state'] === 'published' ? '' : 'disabled' ?>>Send</button>
</form>
<form method="post" action="<?= site_url('admin/announcements/' . $row['id'] . '/archive') ?>">
    <?= csrf_field() ?>
    <button type="submit">Archive</button>
</form>
<?= $this->endSection() ?>
