<?= $this->extend('admin/layout') ?>
<?= $this->section('content') ?>
<?php
use App\Libraries\Quote\MotQuoteFormatter;

$fmt = new MotQuoteFormatter();
$st = (string) ($run['status'] ?? '');
$pill = match ($st) {
    'success' => 'green',
    'running' => 'blue',
    'failed' => 'amber',
    default => 'grey',
};
$statusLabel = ucwords(str_replace('_', ' ', $st));
$last = isset($run['last_price']) && $run['last_price'] !== null && $run['last_price'] !== ''
    ? 'S$' . $fmt->formatPrice((float) $run['last_price'])
    : '—';
$changeAbs = isset($run['change_abs']) ? (float) $run['change_abs'] : null;
$changePct = isset($run['change_pct']) ? (float) $run['change_pct'] : null;
$changeLabel = '—';
if ($changeAbs !== null && $changePct !== null) {
    if ($changeAbs == 0.0) {
        $changeLabel = 'unchanged';
    } else {
        $absPrefix = $changeAbs > 0 ? '+' : '-';
        $pctPrefix = $changePct > 0 ? '+' : '';
        $changeLabel = sprintf(
            '%s%s (%s%.1f%%)',
            $absPrefix,
            $fmt->formatPrice(abs($changeAbs)),
            $pctPrefix,
            $changePct,
        );
    }
}
$error = trim((string) ($run['error_message'] ?? ''));
?>
<header class="page-head">
    <a class="page-back" href="<?= site_url('admin/quote-digest-runs') ?>">← Daily stock digest</a>
    <div class="page-head-row">
        <h1><?= esc((string) ($run['digest_date'] ?? '')) ?>
            <span class="pill <?= esc($pill, 'attr') ?>"><span class="dot"></span><?= esc($statusLabel) ?></span>
        </h1>
    </div>
</header>

<section class="card status-card" aria-label="Run summary">
    <dl class="meta-grid">
        <div>
            <dt>Status</dt>
            <dd><?= esc($statusLabel) ?></dd>
        </div>
        <div>
            <dt>Attempt count</dt>
            <dd><?= esc((string) ($run['attempt_count'] ?? '0')) ?></dd>
        </div>
        <div>
            <dt>Recipients</dt>
            <dd><?= esc((string) ($run['recipient_count'] ?? '0')) ?></dd>
        </div>
        <div>
            <dt>Sent</dt>
            <dd><?= esc((string) ($run['sent_count'] ?? '0')) ?></dd>
        </div>
        <div>
            <dt>Failed deliveries</dt>
            <dd><?= esc((string) ($run['failed_count'] ?? '0')) ?></dd>
        </div>
        <div>
            <dt>Last price</dt>
            <dd><?= esc($last) ?></dd>
        </div>
        <div>
            <dt>Change</dt>
            <dd><?= esc($changeLabel) ?></dd>
        </div>
        <div>
            <dt>Started</dt>
            <dd><?= esc((string) ($run['started_at'] ?? '')) ?></dd>
        </div>
        <div>
            <dt>Finished</dt>
            <dd><?php if (($run['finished_at'] ?? '') !== ''): ?>
                <?= esc((string) $run['finished_at']) ?>
            <?php else: ?>
                <span class="empty-inline">—</span>
            <?php endif; ?></dd>
        </div>
    </dl>
</section>

<?php if ($error !== ''): ?>
<section class="card" aria-label="Error">
    <div class="form-section-head">
        <h2>Error</h2>
    </div>
    <p class="note"><?= esc($error) ?></p>
</section>
<?php endif; ?>

<?php if ($quotePretty !== ''): ?>
<section class="card" aria-label="Quote snapshot">
    <div class="form-section-head">
        <h2>Quote snapshot (JSON)</h2>
        <p class="form-hint">Raw SGX row stored when the run completed or failed.</p>
    </div>
    <pre class="pre-block"><?= esc($quotePretty) ?></pre>
</section>
<?php endif; ?>
<?= $this->endSection() ?>
