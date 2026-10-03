<?= $this->extend('admin/layout') ?>
<?= $this->section('content') ?>

<?php
$values = $row;
foreach ([
    'title', 'category', 'filed_at', 'source_url', 'summary', 'body_html',
    'title_btn', 'title_btn_sm', 'title_banner',
    'issuer_name', 'securities_name', 'stapled_security_name',
    'ann_title', 'ann_subtitle', 'ann_datetime', 'ann_status', 'ann_reference',
    'ann_submitted_by', 'ann_designation', 'ann_description', 'ann_disclaimer',
    'ann_effective_start_date', 'ann_report_type', 'ann_final_year_end',
    'addl_description', 'addl_name', 'addl_age',
    'addl_date_cessation_known', 'addl_date_of_appointment', 'addl_date_cessation',
    'addl_country_of_principal_residence',
] as $key) {
    $default = $key === 'issuer_name'
        ? (string) ($row['issuer_name'] ?? $row['issuer'] ?? '')
        : (string) ($row[$key] ?? '');
    $values[$key] = (string) old($key, $default);
}
$attachments = $attachments ?? [];
$oldNames = old('attachment_name');
$oldUrls = old('attachment_url');
if (is_array($oldNames) || is_array($oldUrls)) {
    $attachments = [];
    $oldNames = is_array($oldNames) ? $oldNames : [];
    $oldUrls = is_array($oldUrls) ? $oldUrls : [];
    $n = max(count($oldNames), count($oldUrls));
    for ($i = 0; $i < $n; $i++) {
        $attachments[] = [
            'name' => (string) ($oldNames[$i] ?? ''),
            'url' => (string) ($oldUrls[$i] ?? ''),
        ];
    }
}
$state = (string) ($row['state'] ?? '');
$isPublished = $state === 'published';
$isArchived = $state === 'archived';
?>

<header class="page-head">
    <a class="page-back" href="<?= site_url('admin/announcements') ?>">← Announcements</a>
    <div class="page-head-row">
        <h1><?= esc($title) ?></h1>
        <div class="page-head-meta">
            <span class="badge"><?= esc((string) ($row['source'] ?? 'sgx')) ?></span>
            <span class="badge badge-state badge-state-<?= esc(preg_replace('/[^a-z0-9_]+/', '', strtolower($state)) ?: 'unknown', 'attr') ?>"><?= esc($state) ?></span>
        </div>
    </div>
</header>

<?php if (session('message')): ?>
    <div class="flash flash-success" role="status"><?= esc((string) session('message')) ?></div>
<?php endif; ?>
<?php if (session('error')): ?>
    <div class="flash flash-error" role="alert"><?= esc((string) session('error')) ?></div>
<?php endif; ?>

<section class="card status-card" aria-label="Record status">
    <dl class="meta-grid">
        <div>
            <dt>Slug</dt>
            <dd><code class="mono"><?= esc((string) ($row['slug'] ?? '')) ?></code></dd>
        </div>
        <div>
            <dt>SGX ref (unique)</dt>
            <dd><?php if (($row['sgx_reference'] ?? '') !== '' && ($row['sgx_reference'] ?? null) !== null): ?>
                <?= esc((string) $row['sgx_reference']) ?>
            <?php else: ?>
                <span class="empty-inline">—</span>
            <?php endif; ?></dd>
        </div>
        <div>
            <dt>Filed</dt>
            <dd><?= esc((string) ($row['filed_at'] ?? '')) ?></dd>
        </div>
        <div>
            <dt>Category</dt>
            <dd><?= esc((string) ($row['category'] ?? '')) ?></dd>
        </div>
    </dl>
</section>

<section class="card actions-card" aria-labelledby="sec-actions">
    <div class="form-section-head">
        <h2 id="sec-actions">Workflow</h2>
        <p class="form-hint">
            <?php if ($isArchived): ?>
                This announcement is archived (hidden from the website). Publish again to restore it live.
            <?php else: ?>
                Publish when the listing is ready. Email alerts require a published announcement.
            <?php endif; ?>
        </p>
    </div>
    <div class="btn-row btn-row-flush">
        <form method="post" action="<?= site_url('admin/announcements/' . $row['id'] . '/publish') ?>">
            <?= csrf_field() ?>
            <button class="btn btn-primary" type="submit" <?= $isPublished ? 'disabled' : '' ?>>
                <?php if ($isPublished): ?>
                    Published
                <?php elseif ($isArchived): ?>
                    Publish again
                <?php else: ?>
                    Publish
                <?php endif; ?>
            </button>
        </form>
        <?php if (! empty($canPreview)): ?>
            <a
                class="btn btn-secondary"
                href="<?= site_url('admin/announcements/' . $row['id'] . '/preview') ?>"
                target="_blank"
                rel="noopener noreferrer"
            >Preview on website</a>
        <?php endif; ?>
        <?php if ($isPublished): ?>
            <a class="btn btn-secondary" href="<?= site_url('admin/email-alerts/new?announcement_id=' . $row['id']) ?>">Create Email Alert</a>
        <?php endif; ?>
        <form method="post" action="<?= site_url('admin/announcements/' . $row['id'] . '/archive') ?>">
            <?= csrf_field() ?>
            <button class="btn btn-secondary" type="submit" <?= $isArchived ? 'disabled' : '' ?>>
                <?= $isArchived ? 'Archived' : 'Archive' ?>
            </button>
        </form>
        <form method="post" action="<?= site_url('admin/announcements/' . $row['id'] . '/delete') ?>">
            <?= csrf_field() ?>
            <button class="btn btn-danger" type="submit">Delete</button>
        </form>
    </div>
</section>

<form class="ann-form" method="post" action="<?= site_url('admin/announcements/' . $row['id'] . '/update') ?>">
    <?= csrf_field() ?>
    <?= view('admin/announcements/_form_sections', ['values' => $values, 'attachments' => $attachments]) ?>
    <div class="form-actions">
        <button class="btn btn-primary" type="submit">Save changes</button>
    </div>
</form>

<details class="form-section card form-disclosure">
    <summary>
        <span class="form-disclosure-title">Source payload</span>
        <span class="form-hint">Raw sync / import payload (read-only).</span>
    </summary>
    <div class="form-disclosure-body">
        <pre class="pre-block"><?= esc($sourcePretty) ?></pre>
    </div>
</details>

<?php if (! empty($offerAlert)): ?>
<dialog class="modal-card" open>
    <div class="modal-inner">
        <h2>Create Email Alert?</h2>
        <p class="form-hint">Announcement is published. Open a draft alert with this announcement attached?</p>
        <div class="btn-row btn-row-flush">
            <form method="post" action="<?= site_url('admin/announcements/' . $row['id'] . '/create-alert-draft') ?>">
                <?= csrf_field() ?>
                <button class="btn btn-primary" type="submit">Yes, create draft</button>
            </form>
            <a class="btn btn-secondary" href="<?= site_url('admin/announcements/' . $row['id']) ?>">Not now</a>
        </div>
    </div>
</dialog>
<?php endif; ?>

<?= $this->endSection() ?>
