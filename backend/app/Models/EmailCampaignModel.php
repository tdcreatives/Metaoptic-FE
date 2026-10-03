<?php
declare(strict_types=1);

namespace App\Models;

use CodeIgniter\Model;

class EmailCampaignModel extends Model
{
    protected $table = 'email_campaigns';
    protected $primaryKey = 'id';
    protected $allowedFields = [
        'announcement_id', 'email_alert_id', 'subject', 'body_html', 'status',
        'recipient_count', 'created_at', 'sent_at',
    ];
    protected $useTimestamps = true;
    protected $updatedField = '';
}
