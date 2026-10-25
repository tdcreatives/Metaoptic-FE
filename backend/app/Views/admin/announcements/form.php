<?= $this->extend('admin/layout') ?>
<?= $this->section('content') ?>

<?php
$values = [];
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
    $values[$key] = (string) old($key, $key === 'category' ? 'General Announcement' : '');
}
$attachments = [];
$oldNames = old('attachment_name');
$oldUrls = old('attachment_url');
if (is_array($oldNames) || is_array($oldUrls)) {
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
?>

<header class="page-head">
    <a class="page-back" href="<?= site_url('admin/announcements') ?>">← Announcements</a>
    <div class="page-head-row">
        <h1><?= esc($title) ?></h1>
    </div>
    <p class="form-hint">Creates a manual announcement in <strong>pending review</strong>. Publish from the detail page when ready.</p>
</header>

<aside class="page-guide" aria-label="New announcement tips">
    <span class="page-guide-label">Tip</span>
    <p>Fill listing fields first (title, category, filed date). Detail / attachments can be completed next. Nothing appears on the public site until you <strong>Publish</strong> from the detail page.</p>
</aside>

<?php if (session('error')): ?>
    <div class="flash flash-error" role="alert"><?= esc((string) session('error')) ?></div>
<?php endif; ?>

<form class="ann-form" method="post" action="<?= site_url('admin/announcements') ?>">
    <?= csrf_field() ?>
    <?= view('admin/announcements/_form_sections', ['values' => $values, 'attachments' => $attachments]) ?>
    <div class="form-actions">
        <a class="btn btn-secondary" href="<?= site_url('admin/announcements') ?>">Cancel</a>
        <button class="btn btn-primary" type="submit">Create announcement</button>
    </div>
</form>

<?= $this->endSection() ?>
