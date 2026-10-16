<?= $this->extend('admin/layout') ?>
<?= $this->section('content') ?>

<?php
use App\Libraries\Admin\AnnouncementWorkflowStatus;

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
$wfLabel = AnnouncementWorkflowStatus::label($row);
$wfPill = AnnouncementWorkflowStatus::pillClass($row);
$wfKey = AnnouncementWorkflowStatus::key($row);
$needsReviewFlag = (int) ($row['needs_review'] ?? 0) === 1;
$canApprove = ! $isPublished || $needsReviewFlag;
?>

<header class="page-head">
    <a class="page-back" href="<?= site_url('admin/announcements') ?>">← Back to announcements</a>
    <div class="page-head-row">
        <h1><?= esc((string) ($row['title'] ?? $title)) ?> <span class="src"><?= esc((string) ($row['source'] ?? 'sgx')) ?></span></h1>
    </div>
</header>

<?php if (session('message')): ?>
    <div class="flash flash-success" role="status"><?= esc((string) session('message')) ?></div>
<?php endif; ?>
<?php if (session('error')): ?>
    <div class="flash flash-error" role="alert"><?= esc((string) session('error')) ?></div>
<?php endif; ?>
<?php if ($needsLiveSync): ?>
    <div class="flash" role="status">
        <?php if ($isPublished): ?>
            <strong>Not on website yet</strong> — approved in CMS
            <?php if (! empty($row['published_at'])): ?>
                (<?= esc((string) $row['published_at']) ?>)
            <?php endif; ?>
            but not on the live website. Use <strong>Publish to live site</strong> on the list.
        <?php else: ?>
            <strong>Pending sync</strong> — still marked live until you click <strong>Publish to live site</strong>.
        <?php endif; ?>
    </div>
<?php endif; ?>

<div class="detail-grid">
    <div class="detail-main">
        <form class="ann-form" method="post" action="<?= site_url('admin/announcements/' . $row['id'] . '/update') ?>">
            <?= csrf_field() ?>
            <?= view('admin/announcements/_form_sections', ['values' => $values, 'attachments' => $attachments]) ?>
            <div class="savebar">
                <span class="muted">Changes save as a draft until you approve.</span>
                <a class="btn btn-secondary" href="<?= site_url('admin/announcements/' . $row['id']) ?>">Discard</a>
                <button class="btn btn-primary" type="submit">Save changes</button>
            </div>
        </form>

        <details class="form-section card form-disclosure" style="margin-top:16px">
            <summary>
                <span class="form-disclosure-title">Source payload</span>
                <span class="form-hint">Raw sync / import payload (read-only).</span>
            </summary>
            <div class="form-disclosure-body">
                <pre class="pre-block"><?= esc($sourcePretty) ?></pre>
            </div>
        </details>
    </div>

    <aside class="detail-side" aria-label="Workflow and record">
        <div class="nextbox">
            <div class="k">Next step</div>
            <?php if ($wfKey === AnnouncementWorkflowStatus::NEEDS_REVIEW || $needsReviewFlag): ?>
                <p>Review the details, then <b>approve</b> this announcement. Approved items go live at the next site build.</p>
            <?php elseif ($wfKey === AnnouncementWorkflowStatus::READY): ?>
                <p>Approved in CMS. Open Announcements and click <b>Publish to live site</b> to build the public website.</p>
            <?php elseif ($wfKey === AnnouncementWorkflowStatus::LIVE): ?>
                <p>This announcement is on the live website. You can create an email alert for subscribers.</p>
            <?php elseif ($isArchived): ?>
                <p>Archived in CMS. Publish again if it should return to the site, then Publish to live site.</p>
            <?php else: ?>
                <p>Save edits, then approve when ready for investors.</p>
            <?php endif; ?>
            <div class="actions-stack">
                <?php if ($canApprove): ?>
                    <form method="post" action="<?= site_url('admin/announcements/' . $row['id'] . '/publish') ?>">
                        <?= csrf_field() ?>
                        <button class="btn go" type="submit">
                            <svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>
                            <?= $isArchived ? 'Publish again' : 'Approve for website' ?>
                        </button>
                    </form>
                <?php else: ?>
                    <button class="btn go" type="button" disabled>Approved (CMS)</button>
                <?php endif; ?>
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
                    <p class="form-hint" style="margin:0;text-align:center">Email Alert after Publish to live site</p>
                <?php endif; ?>
            </div>
        </div>

        <div class="card" style="padding:20px">
            <div style="font-size:12px;text-transform:uppercase;letter-spacing:.06em;color:var(--ink-3);font-weight:700;margin-bottom:14px">Record</div>
            <div class="kv">
                <div class="row"><span class="k">Status</span><span class="v"><span class="pill <?= esc($wfPill, 'attr') ?>"><span class="dot"></span><?= esc($wfLabel) ?></span></span></div>
                <div class="row"><span class="k">On live website</span><span class="v <?= $isLiveOnWebsite ? '' : 'muted' ?>"><?= $isLiveOnWebsite ? esc((string) ($row['live_at'] ?? 'Yes')) : 'Not yet' ?></span></div>
                <div class="row"><span class="k">Category</span><span class="v"><?= esc((string) ($row['category'] ?? '—')) ?></span></div>
                <div class="row"><span class="k">SGX reference</span><span class="v mono"><?php
                    $ref = (string) ($row['sgx_reference'] ?? $row['ann_reference'] ?? '');
                    echo $ref !== '' ? esc($ref) : '—';
                ?></span></div>
                <div class="row"><span class="k">Web address</span><span class="v mono" style="color:var(--blue)"><?php
                    $slug = (string) ($row['slug'] ?? '');
                    echo $slug !== '' ? '/' . esc($slug) : '—';
                ?></span></div>
                <div class="row"><span class="k">Filed</span><span class="v"><?= esc((string) ($row['filed_at'] ?? '—')) ?></span></div>
                <div class="row"><span class="k">Published in CMS</span><span class="v"><?= ! empty($row['published_at']) ? esc((string) $row['published_at']) : '—' ?></span></div>
            </div>
        </div>

        <div class="card" style="padding:14px 16px;display:flex;gap:8px;justify-content:space-between;flex-wrap:wrap">
            <form method="post" action="<?= site_url('admin/announcements/' . $row['id'] . '/archive') ?>">
                <?= csrf_field() ?>
                <button class="btn ghost sm" type="submit" <?= $isArchived ? 'disabled' : '' ?>><?= $isArchived ? 'Archived' : 'Archive' ?></button>
            </form>
            <form method="post" action="<?= site_url('admin/announcements/' . $row['id'] . '/delete') ?>" onsubmit="return confirm('Delete this announcement permanently?');">
                <?= csrf_field() ?>
                <button class="btn btn-danger sm" type="submit">Delete</button>
            </form>
        </div>
    </aside>
</div>

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
