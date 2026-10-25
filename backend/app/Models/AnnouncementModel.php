<?php
declare(strict_types=1);

namespace App\Models;

use CodeIgniter\Model;

class AnnouncementModel extends Model
{
    protected $table = 'announcements';
    protected $primaryKey = 'id';
    protected $allowedFields = [
        'sgx_reference', 'slug', 'source_url', 'title', 'category', 'issuer',
        'filed_at', 'source_payload', 'source_hash', 'source', 'body_html',
        'summary', 'email_subject',
        'email_intro', 'state', 'published_at', 'live_at', 'needs_review',
        'title_btn', 'title_btn_sm', 'title_banner',
        'issuer_name', 'securities_name', 'stapled_security_name',
        'ann_title', 'ann_subtitle', 'ann_datetime', 'ann_status', 'ann_reference',
        'ann_submitted_by', 'ann_designation', 'ann_description', 'ann_disclaimer',
        'ann_effective_start_date', 'ann_report_type', 'ann_final_year_end',
        'addl_description', 'addl_name', 'addl_age', 'addl_date_cessation_known',
        'addl_date_of_appointment', 'addl_date_cessation',
        'addl_country_of_principal_residence',
    ];
    protected $useTimestamps = true;
}
