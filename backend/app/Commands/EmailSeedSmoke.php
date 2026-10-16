<?php
declare(strict_types=1);

namespace App\Commands;

use App\Libraries\Email\UnsubscribeToken;
use CodeIgniter\CLI\BaseCommand;
use CodeIgniter\CLI\CLI;
use Config\EmailAlerts;

class EmailSeedSmoke extends BaseCommand
{
    protected $group = 'Email';
    protected $name = 'email:seed-smoke';
    protected $description = 'Insert ~5000 staging-only smoke subscribers (CI_ENVIRONMENT=staging)';

    private const TARGET = 5000;
    private const CATEGORY = 'General Announcement';

    public function run(array $params): int
    {
        if (! $this->isStaging()) {
            CLI::error('email:seed-smoke only runs when CI_ENVIRONMENT=staging');

            return EXIT_ERROR;
        }

        $db = db_connect();
        $tokens = new UnsubscribeToken((string) config(EmailAlerts::class)->unsubscribeSecret);
        $now = date('Y-m-d H:i:s');
        $inserted = 0;

        for ($i = 1; $i <= self::TARGET; $i++) {
            $email = sprintf('smoke-%05d@example.test', $i);
            if ($db->table('subscribers')->where('email', $email)->countAllResults() > 0) {
                continue;
            }

            $db->table('subscribers')->insert([
                'email' => $email,
                'first_name' => 'Smoke',
                'last_name' => (string) $i,
                'status' => 'active',
                'consented_at' => $now,
                'created_at' => $now,
                'unsubscribe_token_hash' => null,
            ]);
            $id = (int) $db->insertID();
            $db->table('subscribers')->where('id', $id)->update([
                'unsubscribe_token_hash' => $tokens->hashPlain($tokens->forSubscriber($id)),
            ]);
            $db->table('subscriber_categories')->insert([
                'subscriber_id' => $id,
                'category_key' => self::CATEGORY,
            ]);
            $inserted++;
        }

        CLI::write('seeded=' . $inserted . ' target=' . self::TARGET);

        return EXIT_SUCCESS;
    }

    private function isStaging(): bool
    {
        $ci = (string) (getenv('CI_ENVIRONMENT') ?: ($_ENV['CI_ENVIRONMENT'] ?? ''));
        if ($ci !== '') {
            return $ci === 'staging';
        }

        return defined('ENVIRONMENT') && ENVIRONMENT === 'staging';
    }
}
