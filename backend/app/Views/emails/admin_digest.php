<?= (int) ($newCount ?? 0) ?> new SGX announcement(s)

<?php foreach (($refs ?? []) as $ref): ?>
<?= $ref ?>
<?php endforeach; ?>
