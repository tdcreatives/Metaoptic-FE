<?php
declare(strict_types=1);

namespace App\Models;

use CodeIgniter\Model;

class AnnouncementLabeledRowModel extends Model
{
    protected $table = 'announcement_labeled_rows';
    protected $primaryKey = 'id';
    protected $allowedFields = [
        'announcement_id', 'section', 'name', 'text', 'sort_order',
    ];
    protected $useTimestamps = false;
}
