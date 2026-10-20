<?php
/** @var int $newCount */
/** @var list<string> $refs */
/** @var string $mode */
/** @var string $preheader */
$newCount = (int) ($newCount ?? 0);
$refs = $refs ?? [];
$mode = $mode ?? 'review';
$preheader = $preheader ?? 'Internal digest · review in Admin CMS';

if (! in_array($mode, ['review', 'auto_published', 'auto_publish_failed'], true)) {
    $mode = 'review';
}

[$intro, $footer, $emailTitle] = match ($mode) {
    'auto_published' => [
        sprintf(
            'The SGX sync auto-published %d announcement reference%s. A Cloudflare rebuild was triggered:',
            $newCount,
            $newCount === 1 ? '' : 's'
        ),
        'You may unpublish in MetaOptics Admin CMS if needed.',
        sprintf('%d announcement%s auto-published', $newCount, $newCount === 1 ? '' : 's'),
    ],
    'auto_publish_failed' => [
        sprintf(
            'The SGX sync detected %d announcement reference%s, but auto-publish or rebuild failed. They are pending review:',
            $newCount,
            $newCount === 1 ? '' : 's'
        ),
        'Sign in to MetaOptics Admin to review and publish.',
        sprintf('%d announcement%s need review', $newCount, $newCount === 1 ? '' : 's'),
    ],
    default => [
        sprintf(
            'The SGX sync detected %d new announcement reference%s pending review:',
            $newCount,
            $newCount === 1 ? '' : 's'
        ),
        'Sign in to MetaOptics Admin to review and publish.',
        sprintf('%d new SGX announcement%s', $newCount, $newCount === 1 ? '' : 's'),
    ],
};

ob_start();
?>
<p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#18181b;">
<?= esc($intro) ?>
</p>
<?php if ($refs !== []): ?>
<ul style="margin:0 0 16px;padding-left:20px;font-size:15px;line-height:1.6;color:#18181b;">
<?php foreach ($refs as $ref): ?>
<li style="margin-bottom:8px;"><code style="font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:14px;background-color:#f4f4f5;padding:2px 6px;border-radius:4px;"><?= esc((string) $ref) ?></code></li>
<?php endforeach; ?>
</ul>
<?php endif; ?>
<p style="margin:0;font-size:15px;line-height:1.6;color:#71717a;">
<?= esc($footer) ?>
</p>
<?php
echo view('emails/_layout', [
    'emailTitle' => $emailTitle,
    'preheader' => $preheader,
    'emailContent' => ob_get_clean(),
    'unsubscribeUrl' => '',
    'footerNote' => 'Internal notification · MetaOptics IR operations',
    'isInternal' => true,
]);
