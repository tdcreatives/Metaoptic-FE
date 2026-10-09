<?= $this->extend('admin/layout') ?>
<?= $this->section('content') ?>
<?php
$state = (string) ($state ?? '');
$category = (string) ($category ?? '');
$categories = $categories ?? [];
$stateQuery = array_filter([
    'category' => $category !== '' ? $category : null,
]);
?>
<div class="page-head">
    <div class="page-head-row">
        <h1><?= esc($title) ?></h1>
    </div>
</div>
<?php if (session('message')): ?>
    <div class="flash flash-success"><?= esc((string) session('message')) ?></div>
<?php endif; ?>
<?php if (session('error')): ?>
    <div class="flash flash-error"><?= esc((string) session('error')) ?></div>
<?php endif; ?>

<?php $pendingLiveSync = (int) ($pending_live_sync ?? 0); ?>
<aside class="page-guide" aria-label="Announcements tips">
    <span class="page-guide-label">How to use</span>
    <ol>
        <li>Filter by <strong>State</strong> (Pending / Published / …) and optionally by <strong>Category</strong> to narrow the list.</li>
        <li><strong>Publish</strong> in CMS first (approved). Items stay off the public site until you click <strong>Publish to live site</strong>.</li>
        <li><strong>Publish to live site</strong> rebuilds Cloudflare Pages (usually 5–10 minutes) and updates what investors see.</li>
        <li>Create an <strong>Email Alert</strong> only after the item is live on the website.</li>
    </ol>
</aside>

<p class="filter-row" role="navigation" aria-label="Filter by state">
    <a class="<?= $state === '' ? 'is-active' : '' ?>" href="<?= site_url('admin/announcements' . ($stateQuery !== [] ? '?' . http_build_query($stateQuery) : '')) ?>">All</a>
    <a class="<?= $state === 'pending_review' ? 'is-active' : '' ?>" href="<?= site_url('admin/announcements?' . http_build_query($stateQuery + ['state' => 'pending_review'])) ?>">Pending</a>
    <a class="<?= $state === 'published' ? 'is-active' : '' ?>" href="<?= site_url('admin/announcements?' . http_build_query($stateQuery + ['state' => 'published'])) ?>">Published</a>
    <a class="<?= $state === 'archived' ? 'is-active' : '' ?>" href="<?= site_url('admin/announcements?' . http_build_query($stateQuery + ['state' => 'archived'])) ?>">Archived</a>
    <a class="btn btn-primary" href="<?= site_url('admin/announcements/new') ?>">New announcement</a>
    <form class="inline-form" method="post" action="<?= site_url('admin/announcements/publish-to-live-site') ?>">
        <?= csrf_field() ?>
        <button
            class="btn btn-primary"
            type="submit"
            title="Rebuild Cloudflare Pages and sync published/archived changes to the live website"
            onclick="return confirm('Publish to live site now? This rebuilds the public website (usually 5–10 minutes).');"
        >Publish to live site<?php if ($pendingLiveSync > 0): ?> (<?= esc((string) $pendingLiveSync) ?>)<?php endif; ?></button>
    </form>
</p>
<?php if ($pendingLiveSync > 0): ?>
    <div class="flash" role="status">
        <?= esc((string) $pendingLiveSync) ?> item(s) need <strong>Publish to live site</strong> — published in CMS but not yet on the live website, or archived but still marked live.
    </div>
<?php endif; ?>

<form class="card filter-bar" method="get" action="<?= site_url('admin/announcements') ?>" aria-label="Filter by category">
    <?php if ($state !== ''): ?>
        <input type="hidden" name="state" value="<?= esc($state, 'attr') ?>">
    <?php endif; ?>
    <div class="form-group">
        <label class="label" for="category">Category</label>
        <select class="input" id="category" name="category">
            <option value="">All categories</option>
            <?php foreach ($categories as $cat): ?>
                <option value="<?= esc($cat, 'attr') ?>" <?= $category === $cat ? 'selected' : '' ?>><?= esc($cat) ?></option>
            <?php endforeach; ?>
        </select>
    </div>
    <div class="filter-bar-actions">
        <button type="submit" class="btn btn-primary">Apply</button>
        <?php if ($category !== ''): ?>
            <a class="btn btn-secondary" href="<?= site_url('admin/announcements' . ($state !== '' ? '?' . http_build_query(['state' => $state]) : '')) ?>">Clear category</a>
        <?php endif; ?>
    </div>
</form>

<?php if ($announcements === [] || count($announcements) === 0): ?>
    <p class="empty">No announcements match.</p>
<?php else: ?>
<div class="table-wrap">
    <table class="table">
        <thead>
            <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Source</th>
                <th>State</th>
                <th>Filed</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($announcements as $row): ?>
                <?php
                $rowState = (string) ($row['state'] ?? '');
                $badgeClass = 'badge-state-' . (preg_replace('/[^a-z0-9_]+/', '', strtolower($rowState)) ?: 'unknown');
                $rowId = (int) $row['id'];
                $titleShort = mb_strimwidth((string) $row['title'], 0, 80, '…');
                $canPreview = in_array($rowState, ['pending_review', 'archived'], true);
                $rowCategory = trim((string) ($row['category'] ?? ''));
                $needsLiveSync = \App\Libraries\Admin\LiveSiteSync::needsSync($row);
                ?>
                <tr>
                    <td><a href="<?= site_url('admin/announcements/' . $rowId) ?>"><?= esc($row['title']) ?></a></td>
                    <td><?php if ($rowCategory !== ''): ?>
                        <?= esc($rowCategory) ?>
                    <?php else: ?>
                        <span class="empty-inline">—</span>
                    <?php endif; ?></td>
                    <td><span class="badge"><?= esc((string) ($row['source'] ?? 'sgx')) ?></span></td>
                    <td>
                        <?php if ($rowState === 'published'): ?>
                            <button
                                type="button"
                                class="badge badge-state-toggle <?= esc($badgeClass, 'attr') ?>"
                                title="Click to archive in CMS"
                                data-confirm-open
                                data-action="<?= esc(site_url('admin/announcements/' . $rowId . '/archive'), 'attr') ?>"
                                data-title="Archive this announcement?"
                                data-body="<?= esc('“' . $titleShort . '” will be archived in CMS. Run Publish to live site afterward to remove it from the public website.', 'attr') ?>"
                                data-ok="Archive"
                                data-ok-class="btn-danger"
                            ><?= esc($rowState) ?></button>
                            <?php if ($needsLiveSync): ?>
                                <span class="badge badge-pending-sync" title="Published in CMS; not on live website yet">Pending sync</span>
                            <?php endif; ?>
                        <?php elseif ($rowState === 'pending_review' || $rowState === 'archived'): ?>
                            <?php
                            $isArchived = $rowState === 'archived';
                            $confirmTitle = $isArchived ? 'Publish again?' : 'Publish this announcement?';
                            $confirmBody = $isArchived
                                ? '“' . $titleShort . '” will be published in CMS. Run Publish to live site to show it on the public website.'
                                : '“' . $titleShort . '” will be published in CMS only. It will not appear on the live website until you click Publish to live site.';
                            $confirmOk = $isArchived ? 'Publish again' : 'Publish';
                            ?>
                            <button
                                type="button"
                                class="badge badge-state-toggle <?= esc($badgeClass, 'attr') ?>"
                                title="Click to publish in CMS"
                                data-confirm-open
                                data-action="<?= esc(site_url('admin/announcements/' . $rowId . '/publish'), 'attr') ?>"
                                data-title="<?= esc($confirmTitle, 'attr') ?>"
                                data-body="<?= esc($confirmBody, 'attr') ?>"
                                data-ok="<?= esc($confirmOk, 'attr') ?>"
                                data-ok-class="btn-primary"
                            ><?= esc($rowState) ?></button>
                            <?php if ($needsLiveSync): ?>
                                <span class="badge badge-pending-sync" title="Still on live website until Publish to live site">Pending sync</span>
                            <?php endif; ?>
                        <?php else: ?>
                            <span class="badge <?= esc($badgeClass, 'attr') ?>"><?= esc($rowState) ?></span>
                        <?php endif; ?>
                    </td>
                    <td><?= esc((string) $row['filed_at']) ?></td>
                    <td>
                        <?php if ($canPreview): ?>
                            <div class="table-actions">
                                <a
                                    class="btn btn-secondary"
                                    href="<?= site_url('admin/announcements/' . $rowId . '/preview') ?>"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >Preview</a>
                            </div>
                        <?php endif; ?>
                    </td>
                </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
</div>

<dialog id="admin-confirm-dialog" class="modal-card">
    <div class="modal-inner">
        <h2 id="admin-confirm-title">Confirm</h2>
        <p class="form-hint modal-body-text" id="admin-confirm-body"></p>
        <div class="btn-row btn-row-flush">
            <form id="admin-confirm-form" method="post" action="#">
                <?= csrf_field() ?>
                <input type="hidden" name="return_to" value="list">
                <button id="admin-confirm-ok" class="btn btn-primary" type="submit">Confirm</button>
            </form>
            <button type="button" class="btn btn-secondary" data-confirm-close>Cancel</button>
        </div>
    </div>
</dialog>
<script src="<?= esc(base_url('js/admin-confirm-dialog.js'), 'attr') ?>" defer></script>
<?php endif; ?>
<?= $this->endSection() ?>
