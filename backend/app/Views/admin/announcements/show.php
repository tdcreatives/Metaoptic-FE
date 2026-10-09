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
$needsLiveSync = ! empty($needsLiveSync);
$isLiveOnWebsite = ! empty($isLiveOnWebsite);
?>

<header class="page-head">
    <a class="page-back" href="<?= site_url('admin/announcements') ?>">← Announcements</a>
    <div class="page-head-row">
        <h1><?= esc($title) ?></h1>
        <div class="page-head-meta">
            <span class="badge"><?= esc((string) ($row['source'] ?? 'sgx')) ?></span>
            <span class="badge badge-state badge-state-<?= esc(preg_replace('/[^a-z0-9_]+/', '', strtolower($state)) ?: 'unknown', 'attr') ?>"><?= esc($state) ?></span>
            <?php if ($needsLiveSync): ?>
                <span class="badge badge-pending-sync">Pending sync</span>
            <?php elseif ($isLiveOnWebsite): ?>
                <span class="badge badge-live-site">On live website</span>
            <?php endif; ?>
        </div>
    </div>
</header>

<aside class="page-guide" aria-label="Announcement detail tips">
    <span class="page-guide-label">Tip</span>
    <p><strong>Publish</strong> approves in CMS. <strong>Publish to live site</strong> (on the list page) rebuilds the public website. Email alerts are only for items already on the live website.</p>
</aside>
<?php if ($needsLiveSync): ?>
    <div class="flash" role="status">
        <?php if ($isPublished): ?>
            <strong>Not on website yet</strong> — published in CMS
            <?php if (! empty($row['published_at'])): ?>
                (<?= esc((string) $row['published_at']) ?>)
            <?php endif; ?>
            but not on the live website. Open Announcements and click <strong>Publish to live site</strong>.
        <?php else: ?>
            <strong>Pending sync</strong> — still marked live until you click <strong>Publish to live site</strong> to update the public website.
        <?php endif; ?>
    </div>
<?php endif; ?>

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
        <div>
            <dt>Published in CMS</dt>
            <dd><?php if (! empty($row['published_at'])): ?>
                <?= esc((string) $row['published_at']) ?>
            <?php else: ?>
                <span class="empty-inline">—</span>
            <?php endif; ?></dd>
        </div>
        <div>
            <dt>On live website</dt>
            <dd><?php if (! empty($row['live_at'])): ?>
                <?= esc((string) $row['live_at']) ?>
            <?php else: ?>
                <span class="empty-inline">Not yet</span>
            <?php endif; ?></dd>
        </div>
    </dl>
</section>

<section class="card actions-card" aria-labelledby="sec-actions">
    <div class="form-section-head">
        <h2 id="sec-actions">Workflow</h2>
        <p class="form-hint">
            <?php if ($isArchived): ?>
                Archived in CMS. Use Publish to live site on the list if it still appears on the public website.
            <?php else: ?>
                Publish in CMS when ready, then Publish to live site. Email alerts require the item to be on the live website.
            <?php endif; ?>
        </p>
    </div>
    <div class="btn-row btn-row-flush">
        <form method="post" action="<?= site_url('admin/announcements/' . $row['id'] . '/publish') ?>">
            <?= csrf_field() ?>
            <button class="btn btn-primary" type="submit" <?= $isPublished ? 'disabled' : '' ?>>
                <?php if ($isPublished): ?>
                    Published (CMS)
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
        <?php if ($isLiveOnWebsite): ?>
            <a class="btn btn-secondary" href="<?= site_url('admin/email-alerts/new?announcement_id=' . $row['id']) ?>">Create Email Alert</a>
        <?php elseif ($isPublished): ?>
            <span class="form-hint" style="align-self:center;">Email Alert available after Publish to live site</span>
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
        <p class="form-hint">This announcement is on the live website. Open a draft alert with it attached?</p>
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
