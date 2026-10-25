<?php
declare(strict_types=1);

namespace App\Models;

use CodeIgniter\Model;

class AnnouncementRelatedModel extends Model
{
    protected $table = 'announcement_related';
    protected $primaryKey = 'id';
    protected $allowedFields = [
        'announcement_id', 'name', 'text', 'url', 'sort_order',
    ];
    protected $useTimestamps = false;
}
