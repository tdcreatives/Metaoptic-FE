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
        'email_intro', 'state', 'published_at', 'needs_review',
    ];
    protected $useTimestamps = true;
}
