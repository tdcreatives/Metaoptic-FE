<?php
declare(strict_types=1);

namespace App\Models;

use CodeIgniter\Model;

class EmailAlertModel extends Model
{
    protected $table = 'email_alerts';
    protected $primaryKey = 'id';
    protected $allowedFields = [
        'name', 'subject', 'intro', 'body_html', 'status',
        'scheduled_at', 'sent_at', 'audience_categories_json', 'campaign_id',
    ];
    protected $useTimestamps = true;
}
