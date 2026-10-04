<?= $this->extend('admin/layout') ?>
<?= $this->section('content') ?>

<?php
$status = (string) ($alert['status'] ?? '');
$statusClass = preg_replace('/[^a-z0-9_]+/', '', strtolower($status)) ?: 'unknown';
$scheduledAt = (string) ($alert['scheduled_at'] ?? '');
$hasCampaign = ! empty($alert['campaign_id']);
$intro = trim((string) ($alert['intro'] ?? ''));
$bodyHtml = trim((string) ($alert['body_html'] ?? ''));
$deliveriesTotal = (int) ($deliveriesTotal ?? count($deliveries));
?>

<header class="page-head">
    <a class="page-back" href="<?= site_url('admin/email-alerts') ?>">← Email Alerts</a>
    <div class="page-head-row">
        <h1><?= esc($title) ?></h1>
        <div class="page-head-meta">
            <span class="badge badge-state badge-alert-<?= esc($statusClass, 'attr') ?>"><?= esc($status) ?></span>
        </div>
    </div>
    <?php if (! empty($alert['name'])): ?>
        <p class="form-hint">Internal name: <?= esc((string) $alert['name']) ?></p>
    <?php endif; ?>
</header>

<aside class="page-guide" aria-label="Email alert detail tips">
    <span class="page-guide-label">Tip</span>
    <p>Drafts can still be edited. <strong>Send now</strong> queues emails immediately; <strong>Schedule</strong> waits for the workers. Check <strong>Deliveries</strong> below after sending. To change who receives alerts, use the Subscribers page — not this screen.</p>
</aside>

<?php if (session('message')): ?>
    <div class="flash flash-success" role="status"><?= esc((string) session('message')) ?></div>
<?php endif; ?>
<?php if (session('error')): ?>
    <div class="flash flash-error" role="alert"><?= esc((string) session('error')) ?></div>
<?php endif; ?>

<section class="card status-card" aria-label="Alert summary">
    <dl class="meta-grid">
        <div>
            <dt>Subject</dt>
            <dd><?= esc((string) $alert['subject']) ?></dd>
        </div>
        <div>
            <dt>Scheduled (SGT)</dt>
            <dd><?php if ($scheduledAt !== ''): ?>
                <?= esc($scheduledAt) ?>
            <?php else: ?>
                <span class="empty-inline">Not scheduled</span>
            <?php endif; ?></dd>
        </div>
        <div>
            <dt>Audience categories</dt>
            <dd><?php if ($categories === []): ?>
                <span class="empty-inline">—</span>
            <?php else: ?>
                <?= esc(implode(', ', $categories)) ?>
            <?php endif; ?></dd>
        </div>
        <div>
            <dt>Estimated subscribers</dt>
            <dd><?= esc((string) $estimate) ?></dd>
        </div>
    </dl>
</section>

<section class="card actions-card" aria-labelledby="sec-workflow">
    <div class="form-section-head">
        <h2 id="sec-workflow">Workflow</h2>
        <p class="form-hint">
            <?php if ($status === 'draft'): ?>
                Edit content, then send now or schedule. Sending queues deliveries for ~<?= esc((string) $estimate) ?> subscribers.
            <?php elseif ($status === 'scheduled'): ?>
                Waiting for the scheduled time. You can cancel or pick a new time.
            <?php elseif ($status === 'sent'): ?>
                This alert has been queued/sent. Review delivery metrics below.
            <?php else: ?>
                Current status: <?= esc($status) ?>.
            <?php endif; ?>
        </p>
    </div>

    <?php if ($status === 'draft'): ?>
        <div class="btn-row btn-row-flush">
            <a class="btn btn-secondary" href="<?= site_url('admin/email-alerts/' . $alert['id'] . '/edit') ?>">Edit draft</a>
            <form method="post" action="<?= site_url('admin/email-alerts/' . $alert['id'] . '/send-now') ?>">
                <?= csrf_field() ?>
                <button class="btn btn-primary" type="submit">Send now</button>
            </form>
            <form method="post" action="<?= site_url('admin/email-alerts/' . $alert['id'] . '/delete') ?>">
                <?= csrf_field() ?>
                <button class="btn btn-danger" type="submit">Delete</button>
            </form>
        </div>
        <div class="schedule-panel">
            <form method="post" action="<?= site_url('admin/email-alerts/' . $alert['id'] . '/schedule') ?>" class="schedule-form">
                <?= csrf_field() ?>
                <div class="form-group schedule-field">
                    <label class="label" for="scheduled_at">Or schedule (SGT)</label>
                    <div class="schedule-row">
                        <input class="input" id="scheduled_at" type="datetime-local" name="scheduled_at" required>
                        <button class="btn btn-secondary" type="submit">Schedule</button>
                    </div>
                </div>
            </form>
        </div>
    <?php elseif ($status === 'scheduled'): ?>
        <div class="btn-row btn-row-flush">
            <form method="post" action="<?= site_url('admin/email-alerts/' . $alert['id'] . '/cancel') ?>">
                <?= csrf_field() ?>
                <button class="btn btn-secondary" type="submit">Cancel schedule</button>
            </form>
        </div>
        <div class="schedule-panel">
            <form method="post" action="<?= site_url('admin/email-alerts/' . $alert['id'] . '/schedule') ?>" class="schedule-form">
                <?= csrf_field() ?>
                <div class="form-group schedule-field">
                    <label class="label" for="scheduled_at">Reschedule (SGT)</label>
                    <div class="schedule-row">
                        <input class="input" id="scheduled_at" type="datetime-local" name="scheduled_at" required>
                        <button class="btn btn-secondary" type="submit">Update schedule</button>
                    </div>
                </div>
            </form>
        </div>
    <?php elseif ($status === 'sent' && $hasCampaign): ?>
        <div class="btn-row btn-row-flush">
            <form method="post" action="<?= site_url('admin/campaigns/' . $alert['campaign_id'] . '/retry-failed') ?>">
                <?= csrf_field() ?>
                <button class="btn btn-secondary" type="submit">Retry failed deliveries</button>
            </form>
        </div>
    <?php else: ?>
        <p class="empty">No actions available for this status.</p>
    <?php endif; ?>
</section>

<?php if ($hasCampaign || $status === 'sent' || $status === 'sending'): ?>
<section class="card" aria-labelledby="sec-metrics">
    <div class="form-section-head">
        <h2 id="sec-metrics">Delivery metrics</h2>
        <p class="form-hint">Open/click tracking is not enabled yet.</p>
    </div>
    <div class="stat-grid">
        <div class="stat-card">
            <span class="label">Queued</span>
            <span class="value"><?= esc((string) $metrics['queued']) ?></span>
        </div>
        <div class="stat-card">
            <span class="label">Sent</span>
            <span class="value"><?= esc((string) $metrics['sent']) ?></span>
        </div>
        <div class="stat-card">
            <span class="label">Failed</span>
            <span class="value"><?= esc((string) $metrics['failed']) ?></span>
        </div>
    </div>
</section>
<?php endif; ?>

<section class="card" aria-labelledby="sec-attach">
    <div class="form-section-head">
        <h2 id="sec-attach">Attached announcements</h2>
        <p class="form-hint">Content merged into the email via <code class="mono">{{announcement}}</code>.</p>
    </div>
    <?php if ($attaches === []): ?>
        <p class="empty">None attached</p>
    <?php else: ?>
        <div class="table-wrap">
            <table class="table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Filed</th>
                        <th>Source</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($attaches as $row): ?>
                        <?php
                        $label = (string) ($row['snap_title'] ?: $row['title'] ?? '');
                        $when = (string) ($row['snap_filed_at'] ?: $row['filed_at'] ?? '');
                        $url = (string) ($row['snap_url'] ?: $row['source_url'] ?? '');
                        $annId = (int) ($row['announcement_id'] ?? 0);
                        ?>
                        <tr>
                            <td>
                                <?php if ($annId > 0): ?>
                                    <a href="<?= site_url('admin/announcements/' . $annId) ?>"><?= esc($label) ?></a>
                                <?php else: ?>
                                    <?= esc($label) ?>
                                <?php endif; ?>
                            </td>
                            <td><?= esc($when) ?></td>
                            <td>
                                <?php if ($url !== ''): ?>
                                    <a href="<?= esc($url, 'attr') ?>" rel="noopener" target="_blank">Open</a>
                                <?php else: ?>
                                    <span class="empty-inline">—</span>
                                <?php endif; ?>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    <?php endif; ?>
</section>

<?php if ($intro !== '' || $bodyHtml !== ''): ?>
<details class="form-section card form-disclosure" <?= $status === 'draft' ? 'open' : '' ?>>
    <summary>
        <span class="form-disclosure-title">Email content</span>
        <span class="form-hint">Intro and body as stored on this alert.</span>
    </summary>
    <div class="form-disclosure-body">
        <?php if ($intro !== ''): ?>
            <p class="label">Intro</p>
            <p class="content-preview"><?= nl2br(esc($intro)) ?></p>
        <?php endif; ?>
        <?php if ($bodyHtml !== ''): ?>
            <p class="label">Body</p>
            <div class="content-preview content-preview-html"><?= $bodyHtml ?></div>
        <?php endif; ?>
    </div>
</details>
<?php endif; ?>

<section class="card" aria-labelledby="sec-deliveries">
    <div class="form-section-head">
        <h2 id="sec-deliveries">Deliveries</h2>
        <?php if ($deliveries !== []): ?>
            <p class="form-hint">Showing first <?= esc((string) count($deliveries)) ?> of <?= esc((string) $deliveriesTotal) ?>.</p>
        <?php endif; ?>
    </div>
    <?php if ($deliveries === []): ?>
        <p class="empty">No deliveries yet<?= $status === 'draft' ? ' — send or schedule to create the queue' : '' ?>.</p>
    <?php else: ?>
        <div class="table-wrap">
            <table class="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Status</th>
                        <th>Attempts</th>
                        <th>Error</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($deliveries as $row): ?>
                        <tr>
                            <td class="mono"><?= esc((string) $row['id']) ?></td>
                            <td><span class="badge"><?= esc($row['status']) ?></span></td>
                            <td><?= esc((string) $row['attempts']) ?></td>
                            <td><?= esc((string) ($row['last_error'] ?? '')) ?></td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    <?php endif; ?>
</section>

<?= $this->endSection() ?>
