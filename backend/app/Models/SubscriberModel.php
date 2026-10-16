<?php
declare(strict_types=1);

namespace App\Models;

use CodeIgniter\Model;

class SubscriberModel extends Model
{
    protected $table = 'subscribers';
    protected $primaryKey = 'id';
    protected $allowedFields = [
        'email', 'first_name', 'last_name', 'status',
        'consented_at', 'unsubscribed_at', 'unsubscribe_token_hash', 'created_at',
    ];
    protected $useTimestamps = true;
    protected $updatedField = '';
}
