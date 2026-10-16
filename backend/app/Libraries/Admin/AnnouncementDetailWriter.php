<?php
declare(strict_types=1);

namespace App\Libraries\Admin;

use CodeIgniter\Database\BaseConnection;
use RuntimeException;

final class AnnouncementDetailWriter
{
    /** FE-parity detail/layout scalars only (Task 1). Never state/slug/source_*. */
    private const SCALAR_ALLOWLIST = [
        'title_btn' => true,
        'title_btn_sm' => true,
        'title_banner' => true,
        'issuer_name' => true,
        'securities_name' => true,
        'stapled_security_name' => true,
        'ann_title' => true,
        'ann_subtitle' => true,
        'ann_datetime' => true,
        'ann_status' => true,
        'ann_reference' => true,
        'ann_submitted_by' => true,
        'ann_designation' => true,
        'ann_description' => true,
        'ann_disclaimer' => true,
        'ann_effective_start_date' => true,
        'ann_report_type' => true,
        'ann_final_year_end' => true,
        'addl_description' => true,
        'addl_name' => true,
        'addl_age' => true,
        'addl_date_cessation_known' => true,
        'addl_date_of_appointment' => true,
        'addl_date_cessation' => true,
        'addl_country_of_principal_residence' => true,
    ];

    public function __construct(private readonly BaseConnection $db)
    {
    }

    /**
     * @param array<string, mixed> $scalars
     * @param list<array<string, mixed>> $attachments
     * @param list<array<string, mixed>> $related
     * @param list<array<string, mixed>> $labeledRows
     */
    public function replace(int $announcementId, array $scalars, array $attachments, array $related, array $labeledRows): void
    {
        $columns = array_flip($this->db->getFieldNames('announcements'));
        $update = [];
        foreach ($scalars as $key => $value) {
            if (is_string($key) && isset(self::SCALAR_ALLOWLIST[$key]) && isset($columns[$key])) {
                $update[$key] = $value;
            }
        }

        $this->db->transException(true);
        $this->db->transStart();

        if ($update !== []) {
            $this->db->table('announcements')->where('id', $announcementId)->update($update);
        }

        $this->db->table('announcement_attachments')->where('announcement_id', $announcementId)->delete();
        $this->db->table('announcement_related')->where('announcement_id', $announcementId)->delete();
        $this->db->table('announcement_labeled_rows')->where('announcement_id', $announcementId)->delete();

        foreach ($attachments as $i => $row) {
            if (! is_array($row)) {
                continue;
            }
            $this->db->table('announcement_attachments')->insert([
                'announcement_id' => $announcementId,
                'name' => $row['name'] ?? null,
                'url' => $row['url'] ?? null,
                'sort_order' => (int) ($row['sort_order'] ?? $i),
            ]);
        }

        foreach ($related as $i => $row) {
            if (! is_array($row)) {
                continue;
            }
            $this->db->table('announcement_related')->insert([
                'announcement_id' => $announcementId,
                'name' => $row['name'] ?? null,
                'text' => $row['text'] ?? null,
                'url' => $row['url'] ?? null,
                'sort_order' => (int) ($row['sort_order'] ?? $i),
            ]);
        }

        foreach ($labeledRows as $i => $row) {
            if (! is_array($row)) {
                continue;
            }
            $this->db->table('announcement_labeled_rows')->insert([
                'announcement_id' => $announcementId,
                'section' => (string) ($row['section'] ?? ''),
                'name' => $row['name'] ?? null,
                'text' => $row['text'] ?? null,
                'sort_order' => (int) ($row['sort_order'] ?? $i),
            ]);
        }

        $this->db->transComplete();
        if ($this->db->transStatus() === false) {
            throw new RuntimeException('announcement detail replace failed');
        }
    }
}
