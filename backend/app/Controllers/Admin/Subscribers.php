<?php
declare(strict_types=1);

namespace App\Controllers\Admin;

use App\Controllers\BaseController;
use App\Libraries\Admin\SubscriberDirectory;
use App\Libraries\Email\CategoryCatalog;
use CodeIgniter\HTTP\RedirectResponse;
use CodeIgniter\HTTP\ResponseInterface;
use DomainException;
use InvalidArgumentException;

class Subscribers extends BaseController
{
    public function index(): string
    {
        $filters = $this->filtersFromRequest();

        return view('admin/subscribers/index', [
            'title' => 'Subscribers',
            'subscribers' => (new SubscriberDirectory())->list($filters),
            'filters' => $filters,
            'categories' => CategoryCatalog::all(),
            'activeCount' => (new SubscriberDirectory())->countActive(),
        ]);
    }

    public function export(): ResponseInterface
    {
        $filters = $this->filtersFromRequest();
        $rows = (new SubscriberDirectory())->exportRows($filters);

        $lines = ["id,email,first_name,last_name,status,categories,consented_at,unsubscribed_at,created_at"];
        foreach ($rows as $row) {
            $cats = implode(';', $row['categories'] ?? []);
            $lines[] = implode(',', [
                $this->csv((string) $row['id']),
                $this->csv((string) ($row['email'] ?? '')),
                $this->csv((string) ($row['first_name'] ?? '')),
                $this->csv((string) ($row['last_name'] ?? '')),
                $this->csv((string) ($row['status'] ?? '')),
                $this->csv($cats),
                $this->csv((string) ($row['consented_at'] ?? '')),
                $this->csv((string) ($row['unsubscribed_at'] ?? '')),
                $this->csv((string) ($row['created_at'] ?? '')),
            ]);
        }

        return $this->response
            ->setHeader('Content-Type', 'text/csv; charset=utf-8')
            ->setHeader('Content-Disposition', 'attachment; filename="subscribers.csv"')
            ->setBody(implode("\n", $lines) . "\n");
    }

    public function unsubscribe(int $id): RedirectResponse
    {
        try {
            (new SubscriberDirectory())->unsubscribeById($id);
        } catch (DomainException $e) {
            return redirect()->to('/admin/subscribers')
                ->with('error', $e->getMessage());
        }

        return redirect()->to('/admin/subscribers')->with('message', 'Marked unsubscribed');
    }

    /** @return array{status: string, category: string, q: string} */
    private function filtersFromRequest(): array
    {
        $status = trim((string) ($this->request->getGet('status') ?? ''));
        $category = trim((string) ($this->request->getGet('category') ?? ''));
        $q = trim((string) ($this->request->getGet('q') ?? ''));

        if ($category !== '') {
            try {
                CategoryCatalog::assertValid([$category]);
            } catch (InvalidArgumentException) {
                $category = '';
            }
        }

        if ($status !== 'active' && $status !== 'unsubscribed') {
            $status = '';
        }

        return [
            'status' => $status,
            'category' => $category,
            'q' => $q,
        ];
    }

    private function csv(string $value): string
    {
        return '"' . str_replace('"', '""', $value) . '"';
    }
}
