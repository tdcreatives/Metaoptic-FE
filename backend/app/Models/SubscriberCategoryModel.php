<?php
declare(strict_types=1);

namespace App\Models;

use CodeIgniter\Model;

class SubscriberCategoryModel extends Model
{
    protected $table = 'subscriber_categories';
    protected $primaryKey = 'subscriber_id';
    protected $useAutoIncrement = false;
    protected $allowedFields = [
        'subscriber_id', 'category_key',
    ];
    protected $useTimestamps = false;
}
