<?= $this->extend('admin/layout') ?>
<?= $this->section('content') ?>
<div class="page-head">
    <div class="page-head-row">
        <h1><?= esc($title) ?></h1>
    </div>
</div>

<aside class="page-guide" aria-label="Sync history tips">
    <span class="page-guide-label">How to use</span>
    <ul>
        <li>Daily cron usually pulls SGX filings automatically. Use <strong>Sync data now</strong> only for an immediate refresh.</li>
        <li>A run can take a few minutes (list + HTML detail). Keep the tab open until the modal finishes.</li>
        <li><strong>New</strong> items typically arrive as <em>pending review</em> — open Announcements to Preview and Publish.</li>
        <li>If status is <em>failed</em>, read the Error column before retrying. Concurrent syncs are blocked safely.</li>
    </ul>
</aside>

<?php if (session('message')): ?>
    <div class="flash flash-success"><?= esc((string) session('message')) ?></div>
<?php endif; ?>
<?php if (session('error')): ?>
    <div class="flash flash-error"><?= esc((string) session('error')) ?></div>
<?php endif; ?>

<div class="filter-row">
    <button type="button" class="btn btn-primary" id="sync-now-open">Sync data now</button>
</div>

<dialog
    id="sync-now-dialog"
    class="modal-card modal-card-sync"
    aria-labelledby="sync-now-title"
    aria-describedby="sync-now-desc"
>
    <div class="modal-inner">
        <h2 id="sync-now-title">Run SGX sync now?</h2>
        <p class="modal-lead" id="sync-now-desc">Pull the live SGX feed into this CMS.</p>

        <div id="sync-now-step-confirm" class="sync-step">
            <div class="sync-callout sync-callout-warn" role="note">
                <strong>Takes a few minutes</strong>
                <span>HTML detail enrichment can run for several minutes. Stay on this page until it finishes.</span>
            </div>
            <ul class="sync-checklist">
                <li>Calls the live SGX announcements feed</li>
                <li>Creates a new row in Sync history</li>
                <li>If another sync is already running, this request fails safely</li>
            </ul>
            <div class="btn-row btn-row-flush" id="sync-now-actions">
                <button type="button" class="btn btn-primary" id="sync-now-confirm">Start sync</button>
                <button type="button" class="btn btn-secondary" data-sync-close>Cancel</button>
            </div>
        </div>

        <div id="sync-now-step-busy" class="sync-step" hidden>
            <div class="sync-progress" role="status" aria-live="polite" aria-busy="true">
                <span class="sync-now-spinner sync-now-spinner-lg" aria-hidden="true"></span>
                <div class="sync-progress-copy">
                    <strong>Sync in progress…</strong>
                    <span>Do not close or refresh this browser tab.</span>
                    <span class="sync-progress-sub">This can take several minutes. Leaving the page may interrupt the request.</span>
                </div>
            </div>
        </div>

        <div id="sync-now-step-done" class="sync-step" hidden>
            <div id="sync-now-result" class="sync-callout" role="status" aria-live="polite">
                <strong id="sync-now-result-label">Done</strong>
                <span id="sync-now-result-message"></span>
            </div>
            <div class="btn-row btn-row-flush" id="sync-now-done-actions">
                <button type="button" class="btn btn-primary" id="sync-now-reload">Reload page</button>
                <button type="button" class="btn btn-secondary" data-sync-close>Close</button>
            </div>
        </div>
    </div>
</dialog>

<script>
window.ADMIN_SYNC_NOW = {
    url: <?= json_encode(site_url('admin/sync-runs/run-now'), JSON_UNESCAPED_SLASHES) ?>,
    csrfName: <?= json_encode(csrf_token()) ?>,
    csrfHash: <?= json_encode(csrf_hash()) ?>
};
</script>
<script src="<?= esc(base_url('js/admin-sync-now.js'), 'attr') ?>" defer></script>

<?php if ($runs === [] || count($runs) === 0): ?>
    <p class="empty">No sync runs yet. Run <strong>Sync data now</strong> or wait for the scheduled job.</p>
<?php else: ?>
<div class="table-wrap">
    <table class="table">
        <thead>
            <tr>
                <th>ID</th>
                <th>Status</th>
                <th>Started</th>
                <th>Finished</th>
                <th>Fetched</th>
                <th>New</th>
                <th>Updated</th>
                <th>Error</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($runs as $row): ?>
                <?php
                $status = (string) ($row['status'] ?? '');
                $badge = match ($status) {
                    'success' => 'badge-alert-sent',
                    'running' => 'badge-alert-scheduled',
                    'failed' => 'badge-alert-failed',
                    default => '',
                };
                ?>
                <tr>
                    <td><?= esc((string) $row['id']) ?></td>
                    <td><span class="badge <?= esc($badge, 'attr') ?>"><?= esc($status) ?></span></td>
                    <td><?= esc((string) $row['started_at']) ?></td>
                    <td><?= esc((string) ($row['finished_at'] ?? '')) ?></td>
                    <td><?= esc((string) $row['fetched_count']) ?></td>
                    <td><?= esc((string) $row['new_count']) ?></td>
                    <td><?= esc((string) $row['updated_count']) ?></td>
                    <td><?= esc((string) ($row['error_message'] ?? '')) ?></td>
                </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
</div>
<?php endif; ?>
<?= $this->endSection() ?>
