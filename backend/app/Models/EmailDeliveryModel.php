<?php
declare(strict_types=1);

namespace App\Models;

use CodeIgniter\Model;

class EmailDeliveryModel extends Model
{
    protected $table = 'email_deliveries';
    protected $primaryKey = 'id';
    protected $allowedFields = [
        'campaign_id', 'subscriber_id', 'status', 'attempts',
        'provider_message_id', 'last_error',
    ];
    protected $useTimestamps = true;
}
