<?php
/** @var \App\Libraries\Quote\MotQuote|null $quote */
/** @var string $priceLabel */
/** @var string $changeLabel */
/** @var string $asOfLabel */
/** @var string $open */
/** @var string $high */
/** @var string $low */
/** @var string $volumeSharesLabel */
/** @var string $valueLabel */
/** @var string $sgxUrl */
/** @var string $unsubscribeUrl */
/** @var string $preheader */

$preheader = trim((string) ($preheader ?? 'Open, high, low, volume for today’s session · Not investment advice'));
$sgxUrl = (string) ($sgxUrl ?? 'https://investors.sgx.com/market/securities?code=9MT&type=stocks&lang=en');

ob_start();
?>
<h2 style="margin:0 0 20px;font-size:20px;line-height:1.4;font-weight:600;color:#18181b;">
Daily stock update — MetaOptics Ltd (SGX: 9MT)
</h2>
<p style="margin:0 0 8px;font-size:28px;line-height:1.2;font-weight:600;color:#18181b;">
<?= esc($priceLabel ?? '') ?>
<span style="font-size:18px;font-weight:500;color:#52525b;"> <?= esc($changeLabel ?? '') ?></span>
</p>
<p style="margin:0 0 24px;font-size:14px;line-height:1.5;color:#71717a;">
As of <?= esc($asOfLabel ?? '') ?> · Intraday (not official close)
</p>
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:0 0 24px;border-collapse:collapse;font-size:15px;line-height:1.5;color:#18181b;">
<tr>
<th align="left" style="padding:10px 12px;border:1px solid #e4e4e7;background-color:#fafafa;font-weight:600;">Open</th>
<td style="padding:10px 12px;border:1px solid #e4e4e7;">S$<?= esc($open ?? '') ?></td>
</tr>
<tr>
<th align="left" style="padding:10px 12px;border:1px solid #e4e4e7;background-color:#fafafa;font-weight:600;">High</th>
<td style="padding:10px 12px;border:1px solid #e4e4e7;">S$<?= esc($high ?? '') ?></td>
</tr>
<tr>
<th align="left" style="padding:10px 12px;border:1px solid #e4e4e7;background-color:#fafafa;font-weight:600;">Low</th>
<td style="padding:10px 12px;border:1px solid #e4e4e7;">S$<?= esc($low ?? '') ?></td>
</tr>
<tr>
<th align="left" style="padding:10px 12px;border:1px solid #e4e4e7;background-color:#fafafa;font-weight:600;">Volume (shares)</th>
<td style="padding:10px 12px;border:1px solid #e4e4e7;"><?= esc($volumeSharesLabel ?? '') ?></td>
</tr>
<tr>
<th align="left" style="padding:10px 12px;border:1px solid #e4e4e7;background-color:#fafafa;font-weight:600;">Value (SGD)</th>
<td style="padding:10px 12px;border:1px solid #e4e4e7;">$<?= esc($valueLabel ?? '') ?></td>
</tr>
</table>
<p style="margin:0 0 24px;font-size:16px;line-height:1.6;color:#18181b;">
<a href="<?= htmlspecialchars($sgxUrl, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') ?>" style="color:#d44c39;text-decoration:underline;">View MetaOptics (9MT) on SGX</a>
</p>
<p style="margin:0;font-size:13px;line-height:1.6;color:#71717a;">
For information only; not investment advice. Data sourced from SGX and may be delayed.
</p>
<?php
echo view('emails/_layout', [
    'emailTitle' => '',
    'preheader' => $preheader,
    'emailContent' => ob_get_clean(),
    'unsubscribeUrl' => (string) ($unsubscribeUrl ?? ''),
    'footerNote' => 'You received this because you subscribed to MetaOptics IR email alerts.',
]);
