<?= $this->extend('admin/layout') ?>
<?= $this->section('content') ?>
<div class="page-head">
    <div>
        <h1>Settings</h1>
        <p class="lead">Internal tools for the MetaOptics IR team.</p>
    </div>
</div>

<?php if (session('message')): ?>
    <div class="flash flash-success"><?= esc((string) session('message')) ?></div>
<?php endif; ?>
<?php if (session('error')): ?>
    <div class="flash flash-error"><?= esc((string) session('error')) ?></div>
<?php endif; ?>

<div class="detail-grid settings-grid">
    <div class="card card-pad">
        <h2 class="settings-card-title">Internal digest recipients</h2>
        <p class="muted settings-card-sub">
            Team emails that get an internal heads-up when new SGX filings arrive.
            <b>This is not the public investor list</b> — those live under
            <a href="<?= site_url('admin/subscribers') ?>" style="color:var(--blue)">Subscribers</a>.
        </p>

        <?php if ($recipients === [] || count($recipients) === 0): ?>
            <p class="empty" style="margin:0">No digest recipients yet. Add at least one active email if you want internal new-item notices.</p>
        <?php else: ?>
            <div class="table-wrap settings-table-wrap">
                <table class="table tbl">
                    <thead>
                        <tr>
                            <th>Email</th>
                            <th>Status</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($recipients as $row): ?>
                            <?php $isActive = (int) ($row['active'] ?? 0) === 1; ?>
                            <tr>
                                <td><?= esc($row['email']) ?></td>
                                <td>
                                    <?php if ($isActive): ?>
                                        <span class="pill green"><span class="dot"></span>Active</span>
                                    <?php else: ?>
                                        <span class="pill grey"><span class="dot"></span>Inactive</span>
                                    <?php endif; ?>
                                </td>
                                <td class="nowrap" style="text-align:right">
                                    <?php if ($isActive): ?>
                                        <form method="post" action="<?= site_url('admin/settings/recipients') ?>">
                                            <?= csrf_field() ?>
                                            <input type="hidden" name="id" value="<?= esc((string) $row['id'], 'attr') ?>">
                                            <input type="hidden" name="action" value="deactivate">
                                            <button class="btn btn-danger sm" type="submit">Deactivate</button>
                                        </form>
                                    <?php endif; ?>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        <?php endif; ?>
    </div>

    <div class="card card-pad settings-add-card">
        <h2 class="settings-card-title" style="margin-bottom:14px">Add recipient</h2>
        <form method="post" action="<?= site_url('admin/settings/recipients') ?>">
            <?= csrf_field() ?>
            <div class="form-group">
                <label class="label" for="email">Work email</label>
                <input class="input" id="email" type="email" name="email" required placeholder="ir-ops@metaoptics.sg" autocomplete="email">
            </div>
            <button class="btn btn-primary settings-add-btn" type="submit">
                <svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>
                Add recipient
            </button>
        </form>
    </div>
</div>
<?= $this->endSection() ?>
