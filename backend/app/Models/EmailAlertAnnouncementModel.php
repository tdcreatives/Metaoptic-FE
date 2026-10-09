<?php
declare(strict_types=1);

namespace App\Models;

use CodeIgniter\Model;

class EmailAlertAnnouncementModel extends Model
{
    protected $table = 'email_alert_announcements';
    protected $primaryKey = 'id';
    protected $allowedFields = [
        'email_alert_id', 'announcement_id', 'sort_order',
        'snap_title', 'snap_category', 'snap_filed_at', 'snap_url', 'snap_sgx_reference',
    ];
    protected $useTimestamps = false;
}
