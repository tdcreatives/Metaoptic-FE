<?php
declare(strict_types=1);

namespace App\Libraries\Admin;

use Config\Admin;
use Config\EmailAlerts;
use InvalidArgumentException;

/**
 * Short-lived HMAC tokens so unpublished announcements can be previewed on the FE
 * without exposing them on the public slug API.
 */
final class AnnouncementPreviewToken
{
    private const TTL_SECONDS = 1800;

    public function __construct(private readonly string $secret)
    {
        if (strlen($this->secret) < 32) {
            throw new InvalidArgumentException('preview secret must be at least 32 characters');
        }
    }

    public static function fromConfig(): self
    {
        $admin = config(Admin::class);
        $secret = trim((string) ($admin->previewSecret ?? ''));
        if ($secret === '') {
            $secret = trim((string) config(EmailAlerts::class)->unsubscribeSecret);
        }

        return new self($secret);
    }

    public function mint(int $announcementId): string
    {
        if ($announcementId < 1) {
            throw new InvalidArgumentException('announcement id required');
        }

        $exp = time() + self::TTL_SECONDS;
        $payload = $announcementId . '.' . $exp;

        return $payload . '.' . $this->sign($payload);
    }

    /** @return int announcement id */
    public function parse(string $token): int
    {
        $parts = explode('.', trim($token));
        if (count($parts) !== 3) {
            throw new InvalidArgumentException('invalid_token');
        }

        [$idRaw, $expRaw, $sig] = $parts;
        if (! ctype_digit($idRaw) || ! ctype_digit($expRaw) || $sig === '') {
            throw new InvalidArgumentException('invalid_token');
        }

        $id = (int) $idRaw;
        $exp = (int) $expRaw;
        if ($id < 1 || $exp < 1) {
            throw new InvalidArgumentException('invalid_token');
        }

        if ($exp < time()) {
            throw new InvalidArgumentException('expired');
        }

        $payload = $idRaw . '.' . $expRaw;
        if (! hash_equals($this->sign($payload), $sig)) {
            throw new InvalidArgumentException('invalid_token');
        }

        return $id;
    }

    public function pageUrl(string $token): string
    {
        $origin = rtrim((string) config(Admin::class)->fePublicOrigin, '/');
        if ($origin === '') {
            $origin = rtrim((string) config(EmailAlerts::class)->publicSiteUrl, '/');
        }
        if ($origin === '') {
            throw new InvalidArgumentException('fe_origin_missing');
        }

        return $origin . '/investor-relations/company-announcement/preview?t=' . rawurlencode($token);
    }

    private function sign(string $payload): string
    {
        return hash_hmac('sha256', 'preview:' . $payload, $this->secret);
    }
}
