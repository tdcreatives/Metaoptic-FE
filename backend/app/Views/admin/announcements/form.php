<?= $this->extend('admin/layout') ?>
<?= $this->section('content') ?>
<p><a href="<?= site_url('admin/announcements') ?>">← Back to list</a></p>
<h1><?= esc($title) ?></h1>
<?php if (session('error')): ?>
    <div class="flash flash-error"><?= esc((string) session('error')) ?></div>
<?php endif; ?>

<div class="card">
    <form method="post" action="<?= site_url('admin/announcements') ?>">
        <?= csrf_field() ?>
        <div class="form-group">
            <label class="label" for="title">Title</label>
            <input class="input" id="title" type="text" name="title" value="<?= esc((string) old('title')) ?>" required>
        </div>
        <div class="form-group">
            <label class="label" for="category">Category</label>
            <input class="input" id="category" type="text" name="category" value="<?= esc((string) (old('category') ?: 'General Announcement')) ?>" required>
        </div>
        <div class="form-group">
            <label class="label" for="filed_at">Filed at (SGT)</label>
            <input class="input" id="filed_at" type="text" name="filed_at" placeholder="YYYY-MM-DD HH:MM:SS" value="<?= esc((string) old('filed_at')) ?>" required>
        </div>
        <div class="form-group">
            <label class="label" for="source_url">Source URL (optional)</label>
            <input class="input" id="source_url" type="url" name="source_url" value="<?= esc((string) old('source_url')) ?>">
        </div>
        <div class="form-group">
            <label class="label" for="summary">Summary</label>
            <textarea class="input" id="summary" name="summary"><?= esc((string) old('summary')) ?></textarea>
        </div>
        <div class="form-group">
            <label class="label" for="body_html">Body (optional)</label>
            <textarea class="input" id="body_html" name="body_html"><?= esc((string) old('body_html')) ?></textarea>
        </div>
        <button class="btn btn-primary" type="submit">Create</button>
    </form>
</div>
<?= $this->endSection() ?>
