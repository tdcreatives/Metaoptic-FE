<?php
/**
 * Shared HTML email wrapper (table-based, inline styles).
 *
 * @var string      $emailContent  Main body HTML
 * @var string      $emailTitle    Visible heading (optional)
 * @var string      $preheader     Hidden inbox preview line (optional)
 * @var string      $unsubscribeUrl
 * @var string      $footerNote
 * @var bool|null   $isInternal
 */
$emailTitle = (string) ($emailTitle ?? '');
$emailContent = (string) ($emailContent ?? '');
$preheader = (string) ($preheader ?? '');
$unsubscribeUrl = (string) ($unsubscribeUrl ?? '');
$footerNote = (string) ($footerNote ?? '');
$isInternal = ! empty($isInternal);
$siteUrl = rtrim((string) (config('EmailAlerts')->publicSiteUrl ?? ''), '/');
$safeTitle = $emailTitle !== '' ? $emailTitle : 'MetaOptics Investor Relations';
// PNG for Outlook/Gmail; absolute URL so images load when mail is opened off-site
$logoUrl = base_url('img/logo.png');
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title><?= esc($safeTitle) ?></title>
</head>
<body style="margin:0;padding:0;background-color:#fafafa;font-family:ui-sans-serif,system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;color:#18181b;-webkit-text-size-adjust:100%;">
<?php if ($preheader !== ''): ?>
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;"><?= esc($preheader) ?></div>
<?php endif; ?>
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#fafafa;">
<tr>
<td align="center" style="padding:24px 16px;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="max-width:600px;width:100%;background-color:#ffffff;border:1px solid #e4e4e7;border-radius:8px;">
<tr>
<td style="padding:24px 32px 16px;border-bottom:3px solid #d44c39;">
<img src="<?= htmlspecialchars($logoUrl, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') ?>" width="180" alt="MetaOptics" style="display:block;border:0;outline:none;text-decoration:none;height:auto;max-width:180px;">
<p style="margin:10px 0 0;font-size:13px;line-height:1.4;color:#71717a;">
<?= $isInternal ? 'Internal · Investor Relations' : 'Investor Relations' ?>
</p>
</td>
</tr>
<?php if ($emailTitle !== ''): ?>
<tr>
<td style="padding:24px 32px 0;">
<h1 style="margin:0;font-size:22px;line-height:1.35;font-weight:600;color:#18181b;"><?= esc($emailTitle) ?></h1>
</td>
</tr>
<?php endif; ?>
<tr>
<td style="padding:24px 32px;">
<?= $emailContent ?>
</td>
</tr>
<tr>
<td style="padding:0 32px 24px;border-top:1px solid #e4e4e7;">
<?php if ($unsubscribeUrl !== ''): ?>
<p style="margin:24px 0 12px;font-size:14px;line-height:1.6;color:#71717a;">
<a href="<?= htmlspecialchars($unsubscribeUrl, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') ?>" style="color:#d44c39;text-decoration:underline;">Unsubscribe</a>
 or manage your email alert preferences.
</p>
<?php endif; ?>
<?php if ($footerNote !== ''): ?>
<p style="margin:0 0 8px;font-size:13px;line-height:1.5;color:#71717a;"><?= esc($footerNote) ?></p>
<?php endif; ?>
<?php if ($siteUrl !== '' && ! $isInternal): ?>
<p style="margin:0;font-size:13px;line-height:1.5;color:#71717a;">
<a href="<?= htmlspecialchars($siteUrl, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') ?>" style="color:#71717a;text-decoration:underline;">metaoptics.sg</a>
</p>
<?php endif; ?>
</td>
</tr>
</table>
</td>
</tr>
</table>
</body>
</html>
