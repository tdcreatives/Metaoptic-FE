<?= $this->extend('admin/layout') ?>
<?= $this->section('content') ?>
<p><a href="<?= site_url('admin/email-alerts') ?>">← Back to list</a></p>
<h1><?= esc($title) ?></h1>
<?php if (session('error')): ?>
    <div class="flash flash-error"><?= esc((string) session('error')) ?></div>
<?php endif; ?>

<?php
$isEdit = is_array($alert);
$action = $isEdit ? site_url('admin/email-alerts/' . $alert['id']) : site_url('admin/email-alerts');
$name = (string) old('name', $isEdit ? ($alert['name'] ?? '') : '');
$subject = (string) old('subject', $isEdit ? ($alert['subject'] ?? '') : '');
$intro = (string) old('intro', $isEdit ? ($alert['intro'] ?? '') : '');
$bodyHtml = (string) old('body_html', $isEdit ? ($alert['body_html'] ?? '') : '');
$oldIds = old('announcement_ids');
$checked = is_array($oldIds) ? array_map('intval', $oldIds) : $selectedIds;
?>

<div class="card">
    <form method="post" action="<?= $action ?>">
        <?= csrf_field() ?>
        <div class="form-group">
            <label class="label" for="name">Name (optional)</label>
            <input class="input" id="name" type="text" name="name" value="<?= esc($name) ?>">
        </div>
        <div class="form-group">
            <label class="label" for="subject">Subject</label>
            <input class="input" id="subject" type="text" name="subject" value="<?= esc($subject) ?>" required>
        </div>
        <div class="form-group">
            <label class="label" for="intro">Intro (optional)</label>
            <textarea class="input" id="intro" name="intro"><?= esc($intro) ?></textarea>
        </div>
        <div class="form-group">
            <label class="label" for="body_html">Body</label>
            <textarea id="body_html" name="body_html"><?= esc($bodyHtml) ?></textarea>
        </div>
        <div class="form-group">
            <p class="label">Attach published announcements</p>
            <?php if ($published === []): ?>
                <p class="empty">No published announcements</p>
            <?php else: ?>
                <?php foreach ($published as $row): ?>
                    <label>
                        <input type="checkbox" name="announcement_ids[]" value="<?= esc((string) $row['id'], 'attr') ?>"
                            <?= in_array((int) $row['id'], $checked, true) ? 'checked' : '' ?>>
                        <?= esc($row['title']) ?> (<?= esc((string) $row['filed_at']) ?>)
                    </label>
                    <br>
                <?php endforeach; ?>
            <?php endif; ?>
        </div>
        <div class="card">
            <p><strong>Audience (union of categories):</strong> <?= $categories === [] ? '—' : esc(implode(', ', $categories)) ?></p>
            <p><strong>Estimated subscribers:</strong> <?= esc((string) $estimate) ?></p>
        </div>
        <button class="btn btn-primary" type="submit"><?= $isEdit ? 'Save' : 'Create draft' ?></button>
    </form>
</div>
<script src="https://cdn.jsdelivr.net/npm/tinymce@7/tinymce.min.js" referrerpolicy="origin"></script>
<script src="<?= base_url('js/admin-alert-editor.js') ?>"></script>
<?= $this->endSection() ?>
