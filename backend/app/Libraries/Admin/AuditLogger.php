<?php
declare(strict_types=1);

namespace App\Libraries\Admin;

use App\Models\AuditLogModel;

final class AuditLogger
{
    /** @param array<string, mixed> $meta */
    public function write(string $action, ?string $entityType, ?string $entityId, array $meta = []): void
    {
        model(AuditLogModel::class)->insert([
            'action' => $action,
            'entity_type' => $entityType,
            'entity_id' => $entityId,
            'metadata_json' => $meta === [] ? null : json_encode($meta),
        ]);
    }
}
