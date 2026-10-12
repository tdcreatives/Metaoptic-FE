<?= $this->extend('admin/layout') ?>
<?= $this->section('content') ?>
<?php
$pending = (int) ($pending ?? 0);
$ready = (int) ($ready ?? 0);
$live = (int) ($live ?? 0);
$alertDraft = (int) ($alert_draft ?? 0);
$alertSent = (int) ($alert_sent ?? 0);
$subs = (int) ($subscribers_active ?? 0);
$pendingLive = (int) ($pending_live_sync ?? 0);
$readyPreview = $ready_preview ?? [];
$lastSync = $last_sync ?? null;
$greeting = (string) ($greeting ?? 'Good morning');
?>
<div class="page-head">
    <div>
        <h1><?= esc($greeting) ?></h1>
        <p class="lead">Here’s what needs your attention today.</p>
    </div>
</div>

<?php if ($pendingLive > 0): ?>
<div class="tray" role="region" aria-label="Publish to live site">
    <div class="ic-wrap" aria-hidden="true">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
    </div>
    <div class="tray-body">
        <div class="t"><?= esc((string) $ready) ?> announcement<?= $ready === 1 ? '' : 's' ?> approved and waiting to go live</div>
        <div class="s">Publishing builds the website once (~5–10 min) and takes approved items live together.</div>
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

<div class="hero">
    <div class="hero-main">
        <div class="k">Waiting for your review</div>
        <div class="big"><?= esc((string) $pending) ?></div>
        <div class="sub">New SGX filings were pulled in automatically. Review them and approve the ones investors should see.</div>
        <a class="btn btn-primary" href="<?= site_url('admin/announcements?segment=needs_review') ?>">Review announcements →</a>
    </div>
    <div class="hero-side">
        <a class="tile" href="<?= site_url('admin/announcements?segment=live') ?>">
            <div class="ring" style="background:var(--green-wash)" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2.2"><path d="M20 6L9 17l-5-5"/></svg>
            </div>
            <div>
                <div class="n"><?= esc((string) $live) ?></div>
                <div class="l">Live on the website</div>
            </div>
        </a>
        <a class="tile" href="<?= site_url('admin/email-alerts?status=sent') ?>">
            <div class="ring" style="background:var(--blue-wash)" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" stroke-width="2.2"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>
            </div>
            <div>
                <div class="n"><?= esc((string) $alertSent) ?></div>
                <div class="l">Email alerts sent · <?= esc((string) $subs) ?> subscribers</div>
            </div>
        </a>
    </div>
</div>

<div class="section-title">
    <h2>At a glance</h2>
    <div class="spacer"></div>
    <?php if (is_array($lastSync) && ! empty($lastSync['finished_at'] ?? $lastSync['started_at'] ?? null)): ?>
        <span class="muted3" style="font-size:12.5px">
            Last SGX sync: <?= esc((string) ($lastSync['finished_at'] ?? $lastSync['started_at'])) ?>
            · <a href="<?= site_url('admin/sync-runs') ?>" style="color:var(--blue)">view history</a>
        </span>
    <?php else: ?>
        <span class="muted3" style="font-size:12.5px"><a href="<?= site_url('admin/sync-runs') ?>" style="color:var(--blue)">view sync history</a></span>
    <?php endif; ?>
</div>
<div class="mini-row">
    <a class="mini" href="<?= site_url('admin/announcements?segment=needs_review') ?>">
        <div class="l"><span class="dot" style="background:var(--amber)"></span>Needs review</div>
        <div class="n<?= $pending === 0 ? ' zero' : '' ?>"><?= esc((string) $pending) ?></div>
    </a>
    <a class="mini" href="<?= site_url('admin/announcements?segment=ready') ?>">
        <div class="l"><span class="dot" style="background:var(--blue)"></span>Ready to publish</div>
        <div class="n<?= $ready === 0 ? ' zero' : '' ?>"><?= esc((string) $ready) ?></div>
    </a>
    <a class="mini" href="<?= site_url('admin/announcements?segment=live') ?>">
        <div class="l"><span class="dot" style="background:var(--green)"></span>Live on site</div>
        <div class="n<?= $live === 0 ? ' zero' : '' ?>"><?= esc((string) $live) ?></div>
    </a>
    <a class="mini" href="<?= site_url('admin/email-alerts?status=draft') ?>">
        <div class="l"><span class="dot" style="background:var(--ink-3)"></span>Email drafts</div>
        <div class="n<?= $alertDraft === 0 ? ' zero' : '' ?>"><?= esc((string) $alertDraft) ?></div>
    </a>
</div>

<div class="card sync-health-card">
    <div class="sync-health-icon" aria-hidden="true">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 11-3-6.7L21 8"/><path d="M21 3v5h-5"/></svg>
    </div>
    <div style="flex:1">
        <div style="font-weight:650">SGX sync is healthy</div>
        <div class="muted" style="font-size:13px">Filings pull automatically. You only review, approve, and publish.</div>
    </div>
    <a class="btn btn-secondary btn sm" href="<?= site_url('admin/sync-runs') ?>">Sync history</a>
</div>
<?= $this->endSection() ?>
