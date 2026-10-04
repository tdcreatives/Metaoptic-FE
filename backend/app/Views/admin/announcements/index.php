<?= $this->extend('admin/layout') ?>
<?= $this->section('content') ?>
<?php $state = (string) ($state ?? ''); ?>
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

<aside class="page-guide" aria-label="Announcements tips">
    <span class="page-guide-label">How to use</span>
    <ol>
        <li>Filter by <strong>Pending</strong> for new SGX / manual items waiting for review.</li>
        <li>Open a row to edit listing &amp; detail fields, or use <strong>Preview</strong> to see the real website layout (signed link, expires ~30 min).</li>
        <li>Click the <strong>State</strong> badge to Publish (live on the site) or Archive (hide). Confirm in the dialog first.</li>
        <li>After Publish, create an <strong>Email Alert</strong> from the detail page if investors should be notified.</li>
    </ol>
</aside>

<p class="filter-row">
    <a class="<?= $state === '' ? 'is-active' : '' ?>" href="<?= site_url('admin/announcements') ?>">All</a>
    <a class="<?= $state === 'pending_review' ? 'is-active' : '' ?>" href="<?= site_url('admin/announcements?state=pending_review') ?>">Pending</a>
    <a class="<?= $state === 'published' ? 'is-active' : '' ?>" href="<?= site_url('admin/announcements?state=published') ?>">Published</a>
    <a class="<?= $state === 'archived' ? 'is-active' : '' ?>" href="<?= site_url('admin/announcements?state=archived') ?>">Archived</a>
    <a class="btn btn-primary" href="<?= site_url('admin/announcements/new') ?>">New announcement</a>
</p>
<?php if ($announcements === [] || count($announcements) === 0): ?>
    <p class="empty">No announcements</p>
<?php else: ?>
<div class="table-wrap">
    <table class="table">
        <thead>
            <tr>
                <th>Title</th>
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
                ?>
                <tr>
                    <td><a href="<?= site_url('admin/announcements/' . $rowId) ?>"><?= esc($row['title']) ?></a></td>
                    <td><span class="badge"><?= esc((string) ($row['source'] ?? 'sgx')) ?></span></td>
                    <td>
                        <?php if ($rowState === 'published'): ?>
                            <button
                                type="button"
                                class="badge badge-state-toggle <?= esc($badgeClass, 'attr') ?>"
                                title="Click to archive (hide from website)"
                                data-confirm-open
                                data-action="<?= esc(site_url('admin/announcements/' . $rowId . '/archive'), 'attr') ?>"
                                data-title="Archive this announcement?"
                                data-body="<?= esc('“' . $titleShort . '” will be hidden from the public IR website immediately. Email alerts already sent are not affected.', 'attr') ?>"
                                data-ok="Archive"
                                data-ok-class="btn-danger"
                            ><?= esc($rowState) ?></button>
                        <?php elseif ($rowState === 'pending_review' || $rowState === 'archived'): ?>
                            <?php
                            $isArchived = $rowState === 'archived';
                            $confirmTitle = $isArchived ? 'Publish again?' : 'Publish this announcement?';
                            $confirmBody = $isArchived
                                ? '“' . $titleShort . '” will be restored and visible on the public IR website.'
                                : '“' . $titleShort . '” will become visible on the public IR website. You can still compose an Email Alert afterward from the detail page.';
                            $confirmOk = $isArchived ? 'Publish again' : 'Publish';
                            ?>
                            <button
                                type="button"
                                class="badge badge-state-toggle <?= esc($badgeClass, 'attr') ?>"
                                title="Click to publish (show on website)"
                                data-confirm-open
                                data-action="<?= esc(site_url('admin/announcements/' . $rowId . '/publish'), 'attr') ?>"
                                data-title="<?= esc($confirmTitle, 'attr') ?>"
                                data-body="<?= esc($confirmBody, 'attr') ?>"
                                data-ok="<?= esc($confirmOk, 'attr') ?>"
                                data-ok-class="btn-primary"
                            ><?= esc($rowState) ?></button>
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
