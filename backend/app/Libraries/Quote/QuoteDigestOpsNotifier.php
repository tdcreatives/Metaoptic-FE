<?php
declare(strict_types=1);

namespace App\Libraries\Quote;

use App\Libraries\Admin\AdminDigestNotifier;
use App\Libraries\Email\MailMessage;
use Config\Services;
use Throwable;

final class QuoteDigestOpsNotifier
{
    public function notifyFailure(string $digestDate, string $reason, ?int $runId = null): void
    {
        $emails = (new AdminDigestNotifier())->activeEmails();
        if ($emails === []) {
            return;
        }

        $subject = sprintf('Daily 9MT digest failed — %s', $digestDate);
        $textBody = $reason;
        if ($runId !== null) {
            $textBody .= "\n\n" . site_url('admin/quote-digest-runs/' . $runId);
        }

        $mailer = Services::mailer();
        foreach ($emails as $to) {
            try {
                $mailer->send(new MailMessage($to, $subject, $textBody));
            } catch (Throwable) {
                // ponytail: per-recipient catch so one send() failure does not skip the rest
                log_message('notice', sprintf(
                    'quote_digest_ops send_failed digest_date=%s run_id=%s',
                    $digestDate,
                    $runId === null ? '' : (string) $runId
                ));
            }
        }
    }
}
