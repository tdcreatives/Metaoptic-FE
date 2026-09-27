<?= $this->extend('admin/layout') ?>
<?= $this->section('content') ?>
<h1><?= esc($title) ?></h1>
<?php if (session('message')): ?>
    <div class="flash flash-success"><?= esc((string) session('message')) ?></div>
<?php endif; ?>
<?php if (session('error')): ?>
    <div class="flash flash-error"><?= esc((string) session('error')) ?></div>
<?php endif; ?>

<div class="card">
    <form method="post" action="<?= site_url('admin/settings/recipients') ?>">
        <?= csrf_field() ?>
        <div class="form-group">
            <label class="label" for="email">Email</label>
            <input class="input" id="email" type="email" name="email" required>
        </div>
        <button class="btn btn-primary" type="submit">Add</button>
    </form>
</div>

<?php if ($recipients === [] || count($recipients) === 0): ?>
    <p class="empty">No recipients</p>
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
