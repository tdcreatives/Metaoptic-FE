<?php
declare(strict_types=1);

namespace App\Libraries\Admin;

use App\Libraries\Email\CategoryCatalog;
use App\Models\SubscriberModel;
use CodeIgniter\Database\BaseBuilder;
use DomainException;

/**
 * Admin read directory + mark-unsubscribed (Option B).
 * Never returns unsubscribe_token_hash to callers.
 */
final class SubscriberDirectory
{
    public function __construct(
        private readonly SubscriberModel $subscribers = new SubscriberModel(),
        private readonly AuditLogger $audit = new AuditLogger(),
    ) {
    }

    /**
     * @param array{status?: string, category?: string, q?: string} $filters
     * @return list<array<string, mixed>>
     */
    public function list(array $filters = []): array
    {
        $builder = $this->filteredBuilder($filters);
        $rows = $builder
            ->select('s.id, s.email, s.first_name, s.last_name, s.status, s.consented_at, s.unsubscribed_at, s.created_at', false)
            ->orderBy('s.id', 'DESC')
            ->get()
            ->getResultArray();

        return $this->attachCategories($rows);
    }

    /**
     * @param array{status?: string, category?: string, q?: string} $filters
     * @return list<array<string, mixed>>
     */
    public function exportRows(array $filters = []): array
    {
        $rows = $this->list($filters);
        $this->audit->write('export', 'subscriber', null, ['count' => count($rows)]);

        return $rows;
    }

    public function unsubscribeById(int $id): void
    {
        $row = $this->subscribers->find($id);
        if ($row === null) {
            throw new DomainException('not_found');
        }
        if (($row['status'] ?? '') === 'unsubscribed') {
            throw new DomainException('already_unsubscribed');
        }

        $this->subscribers->update($id, [
            'status' => 'unsubscribed',
            'unsubscribed_at' => date('Y-m-d H:i:s'),
        ]);
        $this->audit->write('unsubscribe', 'subscriber', (string) $id, ['via' => 'admin']);
    }

    public function countActive(): int
    {
        return $this->subscribers->where('status', 'active')->countAllResults();
    }

    /**
     * @param array{status?: string, category?: string, q?: string} $filters
     */
    private function filteredBuilder(array $filters): BaseBuilder
    {
        $db = db_connect();
        $builder = $db->table('subscribers s');

        $status = trim((string) ($filters['status'] ?? ''));
        if ($status === 'active' || $status === 'unsubscribed') {
            $builder->where('s.status', $status);
        }

        $q = trim((string) ($filters['q'] ?? ''));
        if ($q !== '') {
            $builder->like('s.email', $q);
        }

        $category = trim((string) ($filters['category'] ?? ''));
        if ($category !== '') {
            CategoryCatalog::assertValid([$category]);
            $catTable = $db->prefixTable('subscriber_categories');
            $builder->where(
                "EXISTS (SELECT 1 FROM {$catTable} sc WHERE sc.subscriber_id = s.id AND sc.category_key = "
                . $db->escape($category) . ')',
                null,
                false
            );
        }

        return $builder;
    }

    /**
     * @param list<array<string, mixed>> $rows
     * @return list<array<string, mixed>>
     */
    private function attachCategories(array $rows): array
    {
        if ($rows === []) {
            return [];
        }

        $ids = array_map(static fn (array $r): int => (int) $r['id'], $rows);
        $catRows = db_connect()->table('subscriber_categories')
            ->whereIn('subscriber_id', $ids)
            ->orderBy('category_key', 'ASC')
            ->get()
            ->getResultArray();

        $byId = [];
        foreach ($catRows as $c) {
            $sid = (int) $c['subscriber_id'];
            $byId[$sid][] = (string) $c['category_key'];
        }

        foreach ($rows as &$row) {
            $id = (int) $row['id'];
            $row['categories'] = $byId[$id] ?? [];
            unset($row['unsubscribe_token_hash']);
        }
        unset($row);

        return $rows;
    }
}
