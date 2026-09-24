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
    public function notifyNewItems(int $newCount, array $refs): void
    {
        $emails = $this->activeEmails();
        if ($newCount < 1 || $emails === []) {
            return;
        }

        $subject = sprintf('MetaOptics admin digest: %d new item(s)', $newCount);
        $viewFile = APPPATH . 'Views/emails/admin_digest.php';
        $body = is_file($viewFile)
            ? (string) view('emails/admin_digest', ['newCount' => $newCount, 'refs' => $refs])
            : sprintf('admin_digest new_count=%d refs=%s', $newCount, implode(',', $refs));

        $mailer = Services::mailer();
        foreach ($emails as $to) {
            try {
                $mailer->send(new MailMessage($to, $subject, $body));
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
