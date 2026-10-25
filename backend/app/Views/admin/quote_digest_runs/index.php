<?= $this->extend('admin/layout') ?>
<?= $this->section('content') ?>
<?php
use App\Libraries\Quote\MotQuoteFormatter;

$fmt = new MotQuoteFormatter();
$statusLabel = static function (string $status): string {
    return ucwords(str_replace('_', ' ', $status));
};
$statusPill = static function (string $status): string {
    return match ($status) {
        'success' => 'green',
        'running' => 'blue',
        'failed' => 'amber',
        default => 'grey',
    };
};
$formatChange = static function (?string $abs, ?string $pct) use ($fmt): string {
    if ($abs === null || $abs === '' || $pct === null || $pct === '') {
        return '—';
    }
    $a = (float) $abs;
    $p = (float) $pct;
    if ($a == 0.0) {
        return 'unchanged';
    }
    $absPrefix = $a > 0 ? '+' : '-';
    $pctPrefix = $p > 0 ? '+' : '';

    return sprintf(
        '%s%s (%s%.1f%%)',
        $absPrefix,
        $fmt->formatPrice(abs($a)),
        $pctPrefix,
        $p,
    );
};
?>
<div class="page-head">
    <h1>Daily stock digest</h1>
    <p class="lead">Automatic 9MT quote emails at 4:00pm SGT on trading days. Read-only history for ops.</p>
</div>

<div class="note">
    Failures alert admin digest recipients by email. Each row links to the quote snapshot and delivery counts for that day.
</div>

<?php if ($runs === [] || count($runs) === 0): ?>
    <p class="empty">No digest runs yet. The scheduled job creates a row on each trading day.</p>
<?php else: ?>
<div class="table-wrap">
    <table class="table tbl">
        <thead>
            <tr>
                <th class="nowrap">Date</th>
                <th>Status</th>
                <th class="nowrap">Recipients</th>
                <th class="nowrap">Last</th>
                <th class="nowrap">Change</th>
                <th class="nowrap">Finished</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($runs as $row): ?>
                <?php
                $st = (string) ($row['status'] ?? '');
                $pill = $statusPill($st);
                $last = isset($row['last_price']) && $row['last_price'] !== null && $row['last_price'] !== ''
                    ? 'S$' . $fmt->formatPrice((float) $row['last_price'])
                    : '—';
                $recipients = (int) ($row['recipient_count'] ?? 0);
                $sent = (int) ($row['sent_count'] ?? 0);
                $recLabel = $recipients > 0 ? $sent . ' / ' . $recipients : (string) $recipients;
                ?>
                <tr>
                    <td class="nowrap"><?= esc((string) ($row['digest_date'] ?? '')) ?></td>
                    <td><span class="pill <?= esc($pill, 'attr') ?>"><span class="dot"></span><?= esc($statusLabel($st)) ?></span></td>
                    <td class="nowrap"><?= esc($recLabel) ?></td>
                    <td class="nowrap"><?= esc($last) ?></td>
                    <td class="nowrap"><?= esc($formatChange(
                        isset($row['change_abs']) ? (string) $row['change_abs'] : null,
                        isset($row['change_pct']) ? (string) $row['change_pct'] : null,
                    )) ?></td>
                    <td class="muted nowrap"><?= esc((string) ($row['finished_at'] ?? '')) ?></td>
                    <td class="nowrap"><a href="<?= site_url('admin/quote-digest-runs/' . $row['id']) ?>">View</a></td>
                </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
</div>
<?php endif; ?>
<?= $this->endSection() ?>
