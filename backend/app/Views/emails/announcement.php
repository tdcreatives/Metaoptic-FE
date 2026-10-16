<?php
/** @var string $title */
/** @var string $intro */
/** @var bool $introIsHtml */
/** @var string $unsubscribeUrl */
$siteUrl = rtrim((string) (config('EmailAlerts')->publicSiteUrl ?? ''), '/');
$heading = trim((string) ($title ?? ''));
$plainIntro = trim(strip_tags((string) ($intro ?? '')));
$preheader = $plainIntro !== '' ? mb_substr($plainIntro, 0, 120) : 'New MetaOptics company announcement';

ob_start();
?>
<?php if ($heading !== ''): ?>
<h2 style="margin:0 0 16px;font-size:20px;line-height:1.4;font-weight:600;color:#18181b;"><?= esc($heading) ?></h2>
<?php endif; ?>
<div style="font-size:16px;line-height:1.6;color:#18181b;">
<?php if (! empty($introIsHtml)): ?>
<?= $intro ?>
<?php else: ?>
<p style="margin:0;"><?= esc($intro ?? '') ?></p>
<?php endif; ?>
</div>
<?php if ($siteUrl !== ''): ?>
<p style="margin:24px 0 0;font-size:16px;line-height:1.6;color:#18181b;">
<a href="<?= htmlspecialchars($siteUrl . '/investor-relations/company-announcement', ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') ?>" style="color:#d44c39;text-decoration:underline;">View all company announcements</a>
</p>
<?php endif; ?>
<?php
echo view('emails/_layout', [
    'emailTitle' => '',
    'preheader' => $preheader,
    'emailContent' => ob_get_clean(),
    'unsubscribeUrl' => (string) ($unsubscribeUrl ?? ''),
    'footerNote' => 'You received this because you subscribed to MetaOptics IR email alerts.',
]);
