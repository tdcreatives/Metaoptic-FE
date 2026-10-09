<?php
/** @var int $newCount */
/** @var list<string> $refs */
$newCount = (int) ($newCount ?? 0);
$refs = $refs ?? [];

ob_start();
?>
<p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#18181b;">
The SGX sync detected <?= $newCount ?> new announcement reference<?= $newCount === 1 ? '' : 's' ?> pending review:
</p>
<?php if ($refs !== []): ?>
<ul style="margin:0 0 16px;padding-left:20px;font-size:15px;line-height:1.6;color:#18181b;">
<?php foreach ($refs as $ref): ?>
<li style="margin-bottom:8px;"><code style="font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:14px;background-color:#f4f4f5;padding:2px 6px;border-radius:4px;"><?= esc((string) $ref) ?></code></li>
<?php endforeach; ?>
</ul>
<?php endif; ?>
<p style="margin:0;font-size:15px;line-height:1.6;color:#71717a;">
Sign in to MetaOptics Admin to review and publish.
</p>
<?php
echo view('emails/_layout', [
    'emailTitle' => sprintf('%d new SGX announcement%s', $newCount, $newCount === 1 ? '' : 's'),
    'preheader' => 'Internal digest · review in Admin CMS',
    'emailContent' => ob_get_clean(),
    'unsubscribeUrl' => '',
    'footerNote' => 'Internal notification · MetaOptics IR operations',
    'isInternal' => true,
]);
