<?php
declare(strict_types=1);

namespace App\Models;

use CodeIgniter\Model;

class AdminRecipientModel extends Model
{
    protected $table = 'admin_recipients';
    protected $primaryKey = 'id';
    protected $allowedFields = [
        'email', 'active', 'created_at',
    ];
    protected $useTimestamps = true;
    protected $updatedField = '';
}
