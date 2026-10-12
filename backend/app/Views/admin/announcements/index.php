<?= $this->extend('admin/layout') ?>
<?= $this->section('content') ?>
<?php
use App\Libraries\Admin\AnnouncementWorkflowStatus;
use App\Libraries\Admin\LiveSiteSync;

$segment = (string) ($segment ?? '');
$category = (string) ($category ?? '');
$categories = $categories ?? [];
$counts = $counts ?? ['total' => 0, 'needs_review' => 0, 'ready' => 0, 'live' => 0, 'archived' => 0];
$pendingLiveSync = (int) ($pending_live_sync ?? 0);
$readyPreview = $ready_preview ?? [];
$q = (string) ($q ?? '');

$baseQuery = array_filter([
    'category' => $category !== '' ? $category : null,
    'q' => $q !== '' ? $q : null,
]);
$segUrl = static function (string $seg) use ($baseQuery): string {
    $params = $baseQuery;
    if ($seg !== '') {
        $params['segment'] = $seg;
    }

    return site_url('admin/announcements' . ($params !== [] ? '?' . http_build_query($params) : ''));
};
?>
<div class="page-head page-head-row">
    <div>
        <h1>Announcements</h1>
        <p class="lead">Review SGX filings, approve what investors should see, then publish to the live site.</p>
    </div>
    <div class="spacer"></div>
    <a class="btn btn-primary" href="<?= site_url('admin/announcements/new') ?>">
        <svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>
        New announcement
    </a>
</div>

<?php if (session('message')): ?>
    <div class="flash flash-success"><?= esc((string) session('message')) ?></div>
<?php endif; ?>
<?php if (session('error')): ?>
    <div class="flash flash-error"><?= esc((string) session('error')) ?></div>
<?php endif; ?>

<?php if ($pendingLiveSync > 0): ?>
<div class="tray" role="region" aria-label="Publish to live site">
    <div class="ic-wrap" aria-hidden="true">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
    </div>
    <div class="tray-body">
        <div class="t"><?= esc((string) ($counts['ready'] ?? 0)) ?> approved — ready to go live</div>
        <div class="s">One build (~5–10 min) takes all approved announcements live at once.</div>
        <?php if ($readyPreview !== []): ?>
            <div class="chips">
                <?php foreach ($readyPreview as $chip): ?>
                    <a class="chip" href="<?= site_url('admin/announcements/' . (int) $chip['id']) ?>"><?= esc(mb_strimwidth((string) ($chip['title'] ?? ''), 0, 42, '…')) ?></a>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>
    </div>
    <form class="tray-form" method="post" action="<?= site_url('admin/announcements/publish-to-live-site') ?>">
        <?= csrf_field() ?>
        <button
            class="btn go"
            type="submit"
            onclick="return confirm('Publish to live site now? This rebuilds the public website (usually 5–10 minutes).');"
        >Publish to live site</button>
    </form>
</div>
<?php endif; ?>

<div class="filterbar">
    <nav class="seg" aria-label="Filter by workflow status">
        <a class="<?= $segment === '' ? 'is-on' : '' ?>" href="<?= esc($segUrl(''), 'attr') ?>">All <span class="c"><?= esc((string) $counts['total']) ?></span></a>
        <a class="<?= $segment === 'needs_review' ? 'is-on' : '' ?>" href="<?= esc($segUrl('needs_review'), 'attr') ?>">Needs review <span class="c"><?= esc((string) $counts['needs_review']) ?></span></a>
        <a class="<?= $segment === 'ready' ? 'is-on' : '' ?>" href="<?= esc($segUrl('ready'), 'attr') ?>">Ready <span class="c"><?= esc((string) $counts['ready']) ?></span></a>
        <a class="<?= $segment === 'live' ? 'is-on' : '' ?>" href="<?= esc($segUrl('live'), 'attr') ?>">Live <span class="c"><?= esc((string) $counts['live']) ?></span></a>
        <a class="<?= $segment === 'archived' ? 'is-on' : '' ?>" href="<?= esc($segUrl('archived'), 'attr') ?>">Archived <span class="c"><?= esc((string) $counts['archived']) ?></span></a>
    </nav>
    <div class="spacer"></div>
    <form method="get" action="<?= site_url('admin/announcements') ?>" class="filterbar-cat">
        <?php if ($segment !== ''): ?>
            <input type="hidden" name="segment" value="<?= esc($segment, 'attr') ?>">
        <?php endif; ?>
        <?php if ($q !== ''): ?>
            <input type="hidden" name="q" value="<?= esc($q, 'attr') ?>">
        <?php endif; ?>
        <label class="sr-only" for="category">Category</label>
        <select class="select-ui" id="category" name="category" onchange="this.form.submit()">
            <option value="">All categories</option>
            <?php foreach ($categories as $cat): ?>
                <option value="<?= esc($cat, 'attr') ?>" <?= $category === $cat ? 'selected' : '' ?>><?= esc($cat) ?></option>
            <?php endforeach; ?>
        </select>
    </form>
</div>

<form id="bulk-approve-form" method="post" action="<?= site_url('admin/announcements/bulk-publish') ?>">
    <?= csrf_field() ?>
    <div class="bulkbar" id="bulkbar" hidden>
        <span class="n"><span id="selcount">0</span> selected</span>
        <button class="btn go sm" type="submit" onclick="return confirm('Approve selected announcements in CMS? They will not appear on the live website until you Publish to live site.');">Approve for website</button>
        <button class="btn ghost sm" type="button" data-bulk-clear>Clear</button>
    </div>

<?php if ($announcements === [] || count($announcements) === 0): ?>
    <p class="empty">No announcements match.</p>
<?php else: ?>
<div class="table-wrap">
    <table class="table tbl">
        <thead>
            <tr>
                <th style="width:34px"></th>
                <th>Announcement</th>
                <th>Category</th>
                <th>Status</th>
                <th class="nowrap">Filed</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($announcements as $row): ?>
                <?php
                $rowId = (int) $row['id'];
                $rowState = (string) ($row['state'] ?? '');
                $wfKey = AnnouncementWorkflowStatus::key($row);
                $pill = AnnouncementWorkflowStatus::pillClass($row);
                $label = AnnouncementWorkflowStatus::label($row);
                $titleShort = mb_strimwidth((string) $row['title'], 0, 80, '…');
                $canPreview = in_array($rowState, ['pending_review', 'archived'], true);
                $canSelect = $wfKey === AnnouncementWorkflowStatus::NEEDS_REVIEW
                    || ((int) ($row['needs_review'] ?? 0) === 1 && $rowState === 'published');
                $rowCategory = trim((string) ($row['category'] ?? ''));
                $detailUrl = site_url('admin/announcements/' . $rowId);
                ?>
                <tr>
                    <td>
                        <?php if ($canSelect): ?>
                            <input type="checkbox" class="ck selbox" name="ids[]" value="<?= esc((string) $rowId, 'attr') ?>" aria-label="Select <?= esc($titleShort, 'attr') ?>">
                        <?php endif; ?>
                    </td>
                    <td class="ttl">
                        <a href="<?= esc($detailUrl, 'attr') ?>"><?= esc((string) $row['title']) ?></a>
                        <span class="src"><?= esc((string) ($row['source'] ?? 'sgx')) ?></span>
                    </td>
                    <td class="muted"><?= $rowCategory !== '' ? esc($rowCategory) : '—' ?></td>
                    <td>
                        <span class="pill <?= esc($pill, 'attr') ?>"><span class="dot"></span><?= esc($label) ?></span>
                    </td>
                    <td class="muted nowrap"><?= esc((string) $row['filed_at']) ?></td>
                    <td class="nowrap">
                        <?php if ($wfKey === AnnouncementWorkflowStatus::NEEDS_REVIEW): ?>
                            <a class="btn sm" href="<?= esc($detailUrl, 'attr') ?>">Review</a>
                        <?php elseif ($canPreview): ?>
                            <a class="btn sm btn-secondary" href="<?= site_url('admin/announcements/' . $rowId . '/preview') ?>" target="_blank" rel="noopener noreferrer">Preview</a>
                        <?php endif; ?>
                    </td>
                </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
</div>
<p class="muted3" style="font-size:12.5px;margin-top:12px">Tick boxes on items that need review to approve several at once, then use <b>Publish to live site</b> above to build once.</p>
<?php endif; ?>
</form>
<?= $this->endSection() ?>
