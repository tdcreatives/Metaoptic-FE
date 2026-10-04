<?= $this->extend('admin/layout') ?>
<?= $this->section('content') ?>

<?php
$isEdit = is_array($alert);
$action = $isEdit ? site_url('admin/email-alerts/' . $alert['id']) : site_url('admin/email-alerts');
$name = (string) old('name', $isEdit ? ($alert['name'] ?? '') : '');
$subject = (string) old('subject', $isEdit ? ($alert['subject'] ?? '') : ($prefill_subject ?? ''));
$intro = (string) old('intro', $isEdit ? ($alert['intro'] ?? '') : ($prefill_intro ?? ''));
$bodyHtml = (string) old('body_html', $isEdit ? ($alert['body_html'] ?? '') : ($prefill_body_html ?? ''));
$oldIds = old('announcement_ids');
$checked = is_array($oldIds) ? array_map('intval', $oldIds) : $selectedIds;
?>

<header class="page-head">
    <a class="page-back" href="<?= $isEdit
        ? site_url('admin/email-alerts/' . $alert['id'])
        : site_url('admin/email-alerts') ?>">← <?= $isEdit ? 'Alert detail' : 'Email Alerts' ?></a>
    <div class="page-head-row">
        <h1><?= esc($title) ?></h1>
        <?php if ($isEdit): ?>
            <div class="page-head-meta">
                <span class="badge badge-state badge-alert-draft">draft</span>
            </div>
        <?php endif; ?>
    </div>
    <p class="form-hint">Compose the email, attach published announcements, then return to the detail page to send or schedule.</p>
</header>

<aside class="page-guide" aria-label="Compose tips">
    <span class="page-guide-label">Tip</span>
    <ul>
        <li>Only <strong>published</strong> announcements can be attached.</li>
        <li>Put <code class="mono">{{announcement}}</code> in the HTML body where the attached items should appear.</li>
        <li>Estimated audience is the union of categories from attached announcements — check Subscribers if the count looks wrong.</li>
        <li>Saving keeps a <strong>draft</strong>. Sending/scheduling happens on the next screen.</li>
    </ul>
</aside>

<?php if (session('error')): ?>
    <div class="flash flash-error" role="alert"><?= esc((string) session('error')) ?></div>
<?php endif; ?>

<form class="ann-form" method="post" action="<?= $action ?>">
    <?= csrf_field() ?>

    <section class="form-section card" aria-labelledby="sec-compose">
        <div class="form-section-head">
            <h2 id="sec-compose">Compose</h2>
            <p class="form-hint">Subject is required. Use <code class="mono">{{announcement}}</code> in the body to insert attached items.</p>
        </div>
        <div class="form-group">
            <label class="label" for="name">Internal name</label>
            <input class="input" id="name" type="text" name="name" value="<?= esc($name) ?>" placeholder="Optional — for admin list only">
        </div>
        <div class="form-group">
            <label class="label" for="subject">Subject <span class="req" aria-hidden="true">*</span></label>
            <input class="input" id="subject" type="text" name="subject" value="<?= esc($subject) ?>" required>
        </div>
        <div class="form-group">
            <label class="label" for="intro">Intro</label>
            <textarea class="input" id="intro" name="intro" rows="3" placeholder="Optional short intro above the body"><?= esc($intro) ?></textarea>
        </div>
        <div class="form-group">
            <label class="label" for="body_html">Body</label>
            <textarea id="body_html" name="body_html"><?= esc($bodyHtml) ?></textarea>
        </div>
    </section>

    <section class="form-section card" aria-labelledby="sec-attach-edit">
        <div class="form-section-head">
            <h2 id="sec-attach-edit">Attach announcements</h2>
            <p class="form-hint">Only published announcements can be attached. Audience is the union of their categories.</p>
        </div>
        <?php if ($published === []): ?>
            <p class="empty">No published announcements yet</p>
        <?php else: ?>
            <div class="checkbox-list">
                <?php foreach ($published as $row): ?>
                    <label class="checkbox-row">
                        <input type="checkbox" name="announcement_ids[]" value="<?= esc((string) $row['id'], 'attr') ?>"
                            <?= in_array((int) $row['id'], $checked, true) ? 'checked' : '' ?>>
                        <span>
                            <span class="checkbox-title"><?= esc($row['title']) ?></span>
                            <span class="checkbox-meta"><?= esc((string) $row['filed_at']) ?><?php if (! empty($row['category'])): ?> · <?= esc((string) $row['category']) ?><?php endif; ?></span>
                        </span>
                    </label>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>
    </section>

    <section class="form-section card" aria-labelledby="sec-audience">
        <div class="form-section-head">
            <h2 id="sec-audience">Audience preview</h2>
            <p class="form-hint">Recalculated after save from the attached announcements’ categories.</p>
        </div>
        <dl class="meta-grid">
            <div>
                <dt>Categories</dt>
                <dd><?php if ($categories === []): ?>
                    <span class="empty-inline">—</span>
                <?php else: ?>
                    <?= esc(implode(', ', $categories)) ?>
                <?php endif; ?></dd>
            </div>
            <div>
                <dt>Estimated subscribers</dt>
                <dd><?= esc((string) $estimate) ?></dd>
            </div>
        </dl>
    </section>

    <div class="form-actions">
        <a class="btn btn-secondary" href="<?= $isEdit
            ? site_url('admin/email-alerts/' . $alert['id'])
            : site_url('admin/email-alerts') ?>">Cancel</a>
        <button class="btn btn-primary" type="submit"><?= $isEdit ? 'Save draft' : 'Create draft' ?></button>
    </div>
</form>

<script src="https://cdn.jsdelivr.net/npm/tinymce@7/tinymce.min.js" referrerpolicy="origin"></script>
<script src="<?= base_url('js/admin-alert-editor.js') ?>"></script>
<?= $this->endSection() ?>
