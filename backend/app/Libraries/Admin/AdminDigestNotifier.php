<?php
declare(strict_types=1);

namespace App\Libraries\Admin;

use App\Models\AdminRecipientModel;
use Config\Services;

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

        if (method_exists(Services::class, 'mailer')) {
            Services::mailer()->notifyNewItems($newCount, $refs, $emails);

            return;
        }

        log_message('notice', sprintf(
            'admin_digest new_count=%d refs=%s recipients=%d',
            $newCount,
            implode(',', $refs),
            count($emails)
        ));
    }
}
