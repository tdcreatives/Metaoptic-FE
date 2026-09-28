<p><?= esc($title ?? '') ?></p>
<?php if (! empty($introIsHtml)): ?>
<?= $intro ?>
<?php else: ?>
<p><?= esc($intro ?? '') ?></p>
<?php endif; ?>
<p><a href="<?= htmlspecialchars((string) ($unsubscribeUrl ?? ''), ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') ?>">Unsubscribe</a></p>
