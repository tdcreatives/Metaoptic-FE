<?php
declare(strict_types=1);

namespace App\Models;

use CodeIgniter\Model;

class SyncRunModel extends Model
{
    protected $table = 'sync_runs';
    protected $primaryKey = 'id';
    protected $allowedFields = [
        'started_at', 'finished_at', 'status', 'fetched_count', 'new_count',
        'updated_count', 'error_message', 'created_at',
    ];
    protected $useTimestamps = true;
    protected $updatedField = '';
}
