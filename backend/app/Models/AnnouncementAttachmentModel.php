<?php
declare(strict_types=1);

namespace App\Models;

use CodeIgniter\Model;

class AnnouncementAttachmentModel extends Model
{
    protected $table = 'announcement_attachments';
    protected $primaryKey = 'id';
    protected $allowedFields = [
        'announcement_id', 'name', 'url', 'sort_order',
    ];
    protected $useTimestamps = false;
}
