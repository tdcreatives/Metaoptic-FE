<?php
declare(strict_types=1);

namespace App\Models;

use CodeIgniter\Model;

class AuditLogModel extends Model
{
    protected $table = 'audit_log';
    protected $primaryKey = 'id';
    protected $allowedFields = [
        'action', 'entity_type', 'entity_id', 'metadata_json', 'created_at',
    ];
    protected $useTimestamps = true;
    protected $updatedField = '';
}
