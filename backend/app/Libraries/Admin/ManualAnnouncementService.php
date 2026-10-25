<?php
declare(strict_types=1);

namespace App\Libraries\Admin;

use App\Libraries\Sgx\AnnouncementDetailHydrator;
use App\Models\AnnouncementModel;
use CodeIgniter\Database\BaseConnection;
use InvalidArgumentException;

/**
 * Manual create/update including FE-parity detail scalars + attachments.
 */
final class ManualAnnouncementService
{
    /** @var list<string> */
    public const FE_SCALAR_FIELDS = [
        'title_btn', 'title_btn_sm', 'title_banner',
        'issuer_name', 'securities_name', 'stapled_security_name',
        'ann_title', 'ann_subtitle', 'ann_datetime', 'ann_status', 'ann_reference',
        'ann_submitted_by', 'ann_designation', 'ann_description', 'ann_disclaimer',
        'ann_effective_start_date', 'ann_report_type', 'ann_final_year_end',
        'addl_description', 'addl_name', 'addl_age',
        'addl_date_cessation_known', 'addl_date_of_appointment', 'addl_date_cessation',
        'addl_country_of_principal_residence',
    ];

    public function __construct(
        private readonly AnnouncementModel $model = new AnnouncementModel(),
        private readonly ?BaseConnection $db = null,
    ) {
    }

    /** @param array<string, mixed> $input */
    public function create(array $input): int
    {
        $title = trim((string) ($input['title'] ?? ''));
        if ($title === '') {
            throw new InvalidArgumentException('title required');
        }
        $category = trim((string) ($input['category'] ?? 'General Announcement')) ?: 'General Announcement';
        $filedAt = (string) ($input['filed_at'] ?? '');
        if ($filedAt === '') {
            throw new InvalidArgumentException('filed_at required');
        }
        $state = (string) ($input['state'] ?? 'pending_review');
        if (! in_array($state, ['pending_review', 'published'], true)) {
            throw new InvalidArgumentException('invalid state');
        }

        $payload = json_encode(['manual' => true], JSON_THROW_ON_ERROR);
        $slugBase = $this->slugify($category . '-' . $title . '-manual');
        $slug = $slugBase;
        $i = 1;
        while ($this->model->where('slug', $slug)->first() !== null) {
            $slug = substr($slugBase, 0, 180) . '-' . $i++;
        }

        $now = date('Y-m-d H:i:s');
        $issuerName = trim((string) ($input['issuer_name'] ?? $input['issuer'] ?? ''));
        $id = (int) $this->model->insert([
            'source' => 'manual',
            'sgx_reference' => null,
            'slug' => $slug,
            'source_url' => (string) ($input['source_url'] ?? ''),
            'title' => $title,
            'category' => $category,
            'issuer' => $issuerName,
            'filed_at' => $filedAt,
            'source_payload' => $payload,
            'source_hash' => hash('sha256', $payload),
            'summary' => $input['summary'] ?? null,
            'body_html' => $input['body_html'] ?? null,
            'state' => $state,
            'published_at' => $state === 'published' ? $now : null,
            'needs_review' => 0,
        ], true);

        $this->writeDetails($id, $input, [], []);

        return $id;
    }

    /** @param array<string, mixed> $input */
    public function update(int $id, array $input): void
    {
        $row = $this->model->find($id);
        if (! is_array($row)) {
            throw new InvalidArgumentException('not_found');
        }

        $title = trim((string) ($input['title'] ?? $row['title'] ?? ''));
        if ($title === '') {
            throw new InvalidArgumentException('title required');
        }
        $category = trim((string) ($input['category'] ?? $row['category'] ?? 'General Announcement'))
            ?: 'General Announcement';
        $filedAt = (string) ($input['filed_at'] ?? $row['filed_at'] ?? '');
        if ($filedAt === '') {
            throw new InvalidArgumentException('filed_at required');
        }

        $issuerName = trim((string) ($input['issuer_name'] ?? $input['issuer'] ?? $row['issuer'] ?? ''));
        $this->model->update($id, [
            'title' => $title,
            'category' => $category,
            'filed_at' => $filedAt,
            'source_url' => (string) ($input['source_url'] ?? $row['source_url'] ?? ''),
            'issuer' => $issuerName,
            'summary' => array_key_exists('summary', $input) ? $input['summary'] : ($row['summary'] ?? null),
            'body_html' => array_key_exists('body_html', $input) ? $input['body_html'] : ($row['body_html'] ?? null),
        ]);

        $hydrated = AnnouncementDetailHydrator::hydrate($row);
        $this->writeDetails(
            $id,
            $input,
            is_array($hydrated['_related'] ?? null) ? $hydrated['_related'] : [],
            is_array($hydrated['_labeled_rows'] ?? null) ? $hydrated['_labeled_rows'] : [],
            // ponytail: omit attachment_* from input → keep existing rows (form always posts them)
            array_key_exists('attachment_name', $input) || array_key_exists('attachment_url', $input)
                ? null
                : (is_array($hydrated['_attachments'] ?? null) ? $hydrated['_attachments'] : []),
        );
    }

    /**
     * @param array<string, mixed> $input
     * @return array<string, mixed>
     */
    public static function scalarsFromInput(array $input): array
    {
        $out = [];
        foreach (self::FE_SCALAR_FIELDS as $field) {
            if (! array_key_exists($field, $input)) {
                continue;
            }
            $val = $input[$field];
            if ($val === null) {
                $out[$field] = null;
                continue;
            }
            $str = trim((string) $val);
            $out[$field] = $str === '' ? null : $str;
        }

        return $out;
    }

    /**
     * @param array<string, mixed> $input
     * @return list<array{name: string, url: string, sort_order: int}>
     */
    public static function attachmentsFromInput(array $input): array
    {
        $names = $input['attachment_name'] ?? [];
        $urls = $input['attachment_url'] ?? [];
        if (! is_array($names)) {
            $names = [];
        }
        if (! is_array($urls)) {
            $urls = [];
        }
        $out = [];
        $n = max(count($names), count($urls));
        for ($i = 0; $i < $n; $i++) {
            $name = trim((string) ($names[$i] ?? ''));
            $url = trim((string) ($urls[$i] ?? ''));
            if ($name === '' && $url === '') {
                continue;
            }
            $out[] = ['name' => $name, 'url' => $url, 'sort_order' => count($out)];
        }

        return $out;
    }

    /**
     * @param array<string, mixed> $input
     * @param list<array<string, mixed>> $related
     * @param list<array<string, mixed>> $labeledRows
     * @param list<array<string, mixed>>|null $attachments null = parse from input
     */
    private function writeDetails(
        int $id,
        array $input,
        array $related,
        array $labeledRows,
        ?array $attachments = null,
    ): void {
        $db = $this->db ?? db_connect();
        $scalars = self::scalarsFromInput($input);
        if (isset($input['issuer_name']) || isset($input['issuer'])) {
            $issuer = trim((string) ($input['issuer_name'] ?? $input['issuer'] ?? ''));
            $scalars['issuer_name'] = $issuer === '' ? null : $issuer;
        }
        (new AnnouncementDetailWriter($db))->replace(
            $id,
            $scalars,
            $attachments ?? self::attachmentsFromInput($input),
            $related,
            $labeledRows,
        );
    }

    private function slugify(string $value): string
    {
        $value = strtolower($value);
        $value = preg_replace('/[^a-z0-9]+/', '-', $value) ?? '';
        $value = trim($value, '-') ?: 'announcement';

        return substr($value, 0, 191);
    }
}
