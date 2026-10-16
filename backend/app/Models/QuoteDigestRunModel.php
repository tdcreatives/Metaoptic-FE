<?php
declare(strict_types=1);

namespace App\Models;

use CodeIgniter\Model;

class QuoteDigestRunModel extends Model
{
    protected $table = 'quote_digest_runs';
    protected $primaryKey = 'id';
    protected $allowedFields = [
        'digest_date',
        'status',
        'attempt_count',
        'recipient_count',
        'sent_count',
        'failed_count',
        'last_price',
        'change_abs',
        'change_pct',
        'quote_json',
        'error_message',
        'started_at',
        'finished_at',
    ];
    protected $useTimestamps = true;
}
