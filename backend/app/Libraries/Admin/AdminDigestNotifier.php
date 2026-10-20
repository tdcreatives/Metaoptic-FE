<?php
declare(strict_types=1);

namespace App\Libraries\Admin;

use App\Libraries\Email\MailMessage;
use App\Models\AdminRecipientModel;
use Config\Services;
use Throwable;

final class AdminDigestNotifier
{
    /** @return list<string> */
    public function activeEmails(): array
    {
        $rows = model(AdminRecipientModel::class)->where('active', 1)->findAll();

        return array_values(array_map(static fn (array $row): string => (string) $row['email'], $rows));
    }

    /** @param list<string> $refs */
    public function notifyNewItems(int $newCount, array $refs, string $mode = 'review'): void
    {
        $emails = $this->activeEmails();
        if ($newCount < 1 || $emails === []) {
            return;
        }

        if (! in_array($mode, ['review', 'auto_published', 'auto_publish_failed'], true)) {
            $mode = 'review';
        }

        [$subject, $preheader, $textIntro, $textFooter] = match ($mode) {
            'auto_published' => [
                sprintf('[IR] %d announcement(s) auto-published', $newCount),
                'Auto-published · Cloudflare rebuild triggered',
                sprintf("%d announcement(s) auto-published\n\n", $newCount),
                'Cloudflare rebuild was triggered. You may unpublish in MetaOptics Admin CMS if needed.',
            ],
            'auto_publish_failed' => [
                sprintf('[IR] %d announcement(s) need review (auto-publish failed)', $newCount),
                'Auto-publish failed · review in Admin CMS',
                sprintf("%d announcement(s) synced but auto-publish or rebuild failed\n\n", $newCount),
                'Sign in to MetaOptics Admin to review and publish.',
            ],
            default => [
                sprintf('[IR] %d new SGX announcement(s)', $newCount),
                'Internal digest · review in Admin CMS',
                sprintf("%d new SGX announcement(s)\n\n", $newCount),
                'Sign in to MetaOptics Admin to review and publish.',
            ],
        };

        $htmlBody = (string) view('emails/admin_digest', [
            'newCount' => $newCount,
            'refs' => $refs,
            'mode' => $mode,
            'preheader' => $preheader,
        ]);
        $textBody = $textIntro
            . implode("\n", $refs)
            . "\n\n"
            . $textFooter;

        $mailer = Services::mailer();
        foreach ($emails as $to) {
            try {
                $mailer->send(new MailMessage($to, $subject, $textBody, $htmlBody));
            } catch (Throwable) {
                // ponytail: per-recipient catch so one send() failure does not skip the rest
                log_message('notice', sprintf(
                    'admin_digest send_failed new_count=%d refs=%s',
                    $newCount,
                    implode(',', $refs)
                ));
            }
        }
    }
}
