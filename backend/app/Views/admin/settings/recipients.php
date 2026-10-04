<?= $this->extend('admin/layout') ?>
<?= $this->section('content') ?>
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

<aside class="page-guide" aria-label="Digest recipients tips">
    <span class="page-guide-label">How to use</span>
    <ul>
        <li>These emails receive <strong>internal digests</strong> when new SGX items arrive (admin notification) — not the public investor Email Alerts list.</li>
        <li>Add a work email, then leave it <strong>active</strong>. Use Deactivate to stop digests without deleting history.</li>
        <li>Investor subscribers are managed under <strong>Subscribers</strong>.</li>
    </ul>
</aside>

<div class="card">
    <form method="post" action="<?= site_url('admin/settings/recipients') ?>">
        <?= csrf_field() ?>
        <div class="form-group">
            <label class="label" for="email">Email</label>
            <input class="input" id="email" type="email" name="email" required>
            <p class="form-hint">Example: ir-ops@metaoptics.sg</p>
        </div>
        <button class="btn btn-primary" type="submit">Add</button>
    </form>
</div>

<?php if ($recipients === [] || count($recipients) === 0): ?>
    <p class="empty">No digest recipients yet. Add at least one active email if you want internal new-item notices.</p>
<?php else: ?>
<div class="table-wrap" style="margin-top:1rem">
    <table class="table">
        <thead>
            <tr>
                <th>Email</th>
                <th>Active</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($recipients as $row): ?>
                <tr>
                    <td><?= esc($row['email']) ?></td>
                    <td><?= ((int) $row['active'] === 1) ? 'yes' : 'no' ?></td>
                    <td>
                        <?php if ((int) $row['active'] === 1): ?>
                            <form method="post" action="<?= site_url('admin/settings/recipients') ?>">
                                <?= csrf_field() ?>
                                <input type="hidden" name="id" value="<?= esc((string) $row['id'], 'attr') ?>">
                                <input type="hidden" name="action" value="deactivate">
                                <button class="btn btn-danger" type="submit">Deactivate</button>
                            </form>
                        <?php endif; ?>
                    </td>
                </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
</div>
<?php endif; ?>
<?= $this->endSection() ?>
