<?= $this->extend('admin/layout') ?>
<?= $this->section('content') ?>
<p><a href="<?= site_url('admin/email-alerts') ?>">← Back to list</a></p>
<h1><?= esc($title) ?></h1>
<?php if (session('message')): ?>
    <div class="flash flash-success"><?= esc((string) session('message')) ?></div>
<?php endif; ?>
<?php if (session('error')): ?>
    <div class="flash flash-error"><?= esc((string) session('error')) ?></div>
<?php endif; ?>

<?php $status = (string) $alert['status']; ?>

<div class="card">
    <ul class="meta-list">
        <li><strong>Status:</strong> <span class="badge"><?= esc($status) ?></span></li>
        <?php if (! empty($alert['name'])): ?>
            <li><strong>Name:</strong> <?= esc((string) $alert['name']) ?></li>
        <?php endif; ?>
        <li><strong>Subject:</strong> <?= esc((string) $alert['subject']) ?></li>
        <li><strong>Scheduled (SGT):</strong> <?= esc((string) ($alert['scheduled_at'] ?? '')) ?></li>
        <li><strong>Audience:</strong> <?= $categories === [] ? '—' : esc(implode(', ', $categories)) ?></li>
        <li><strong>Estimated subscribers:</strong> <?= esc((string) $estimate) ?></li>
    </ul>
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
    <div class="stat-card">
        <span class="label">Open</span>
        <span class="value">—</span>
    </div>
    <div class="stat-card">
        <span class="label">Click</span>
        <span class="value">—</span>
    </div>
</div>

<div class="card">
    <h2>Attached announcements</h2>
    <?php if ($attaches === []): ?>
        <p class="empty">None</p>
    <?php else: ?>
        <ul class="meta-list">
            <?php foreach ($attaches as $row): ?>
                <?php
                $label = (string) ($row['snap_title'] ?: $row['title'] ?? '');
                $when = (string) ($row['snap_filed_at'] ?: $row['filed_at'] ?? '');
                $url = (string) ($row['snap_url'] ?: $row['source_url'] ?? '');
                ?>
                <li><?= esc($label) ?> — <?= esc($when) ?><?php if ($url !== ''): ?> — <a href="<?= esc($url, 'attr') ?>"><?= esc($url) ?></a><?php endif; ?></li>
            <?php endforeach; ?>
        </ul>
    <?php endif; ?>
</div>

<div class="card">
    <h2>Actions</h2>
    <div class="btn-row">
        <?php if ($status === 'draft'): ?>
            <a class="btn btn-secondary" href="<?= site_url('admin/email-alerts/' . $alert['id'] . '/edit') ?>">Edit</a>
            <form method="post" action="<?= site_url('admin/email-alerts/' . $alert['id'] . '/send-now') ?>">
                <?= csrf_field() ?>
                <button class="btn btn-primary" type="submit" onclick="return confirm('Send now to approx <?= (int) $estimate ?> subscribers?')">Send now</button>
            </form>
            <form method="post" action="<?= site_url('admin/email-alerts/' . $alert['id'] . '/schedule') ?>">
                <?= csrf_field() ?>
                <div class="form-group">
                    <label class="label" for="scheduled_at">Schedule (SGT)</label>
                    <input class="input" id="scheduled_at" type="datetime-local" name="scheduled_at" required>
                </div>
                <button class="btn btn-secondary" type="submit">Schedule</button>
            </form>
            <form method="post" action="<?= site_url('admin/email-alerts/' . $alert['id'] . '/delete') ?>">
                <?= csrf_field() ?>
                <button class="btn btn-danger" type="submit">Delete</button>
            </form>
        <?php elseif ($status === 'scheduled'): ?>
            <form method="post" action="<?= site_url('admin/email-alerts/' . $alert['id'] . '/cancel') ?>">
                <?= csrf_field() ?>
                <button class="btn btn-secondary" type="submit">Cancel</button>
            </form>
            <form method="post" action="<?= site_url('admin/email-alerts/' . $alert['id'] . '/schedule') ?>">
                <?= csrf_field() ?>
                <div class="form-group">
                    <label class="label" for="scheduled_at">Reschedule (SGT)</label>
                    <input class="input" id="scheduled_at" type="datetime-local" name="scheduled_at" required>
                </div>
                <button class="btn btn-secondary" type="submit">Schedule</button>
            </form>
        <?php elseif ($status === 'sent' && ! empty($alert['campaign_id'])): ?>
            <form method="post" action="<?= site_url('admin/campaigns/' . $alert['campaign_id'] . '/retry-failed') ?>">
                <?= csrf_field() ?>
                <button class="btn btn-secondary" type="submit">Retry failed</button>
            </form>
        <?php endif; ?>
    </div>
</div>

<div class="card">
    <h2>Deliveries</h2>
    <?php $deliveriesTotal = (int) ($deliveriesTotal ?? count($deliveries)); ?>
    <?php if ($deliveries === []): ?>
        <p class="empty">No deliveries</p>
    <?php else: ?>
        <p>Showing first <?= esc((string) count($deliveries)) ?> of <?= esc((string) $deliveriesTotal) ?></p>
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
                            <td><?= esc((string) $row['id']) ?></td>
                            <td><span class="badge"><?= esc($row['status']) ?></span></td>
                            <td><?= esc((string) $row['attempts']) ?></td>
                            <td><?= esc((string) ($row['last_error'] ?? '')) ?></td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    <?php endif; ?>
</div>
<?= $this->endSection() ?>
