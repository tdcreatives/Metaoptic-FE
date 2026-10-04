<?php
/** @var string $unsubscribeUrl */
$siteUrl = rtrim((string) (config('EmailAlerts')->publicSiteUrl ?? ''), '/');

ob_start();
?>
<p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#18181b;">
Thank you for subscribing to MetaOptics investor relations email alerts.
</p>
<p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#18181b;">
We will email you when new company announcements are published on our Investor Relations site.
</p>
<?php if ($siteUrl !== ''): ?>
<p style="margin:0;font-size:16px;line-height:1.6;color:#18181b;">
<a href="<?= htmlspecialchars($siteUrl . '/investor-relations', ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') ?>" style="color:#d44c39;text-decoration:underline;">Visit Investor Relations</a>
</p>
<?php endif; ?>
<?php
echo view('emails/_layout', [
    'emailTitle' => 'Your subscription is confirmed',
    'preheader' => 'You will receive MetaOptics company announcements by email.',
    'emailContent' => ob_get_clean(),
    'unsubscribeUrl' => (string) ($unsubscribeUrl ?? ''),
    'footerNote' => 'You received this email because you subscribed on metaoptics.sg.',
]);
