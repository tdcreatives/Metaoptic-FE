<?php
declare(strict_types=1);

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Libraries\Sgx\AnnouncementPresenter;
use App\Models\AnnouncementModel;
use CodeIgniter\Database\BaseBuilder;
use CodeIgniter\HTTP\ResponseInterface;

class Announcements extends BaseController
{
    public function index(): ResponseInterface
    {
        $this->applyCors();
        $page = max(1, (int) ($this->request->getGet('page') ?? 1));
        $size = min(50, max(1, (int) ($this->request->getGet('page_size') ?? 10)));
        $builder = $this->publishedBuilder();
        $this->applyFilters($builder);

        $total = $builder->countAllResults(false);
        $rows = $builder->orderBy('filed_at', 'DESC')->limit($size, ($page - 1) * $size)->get()->getResultArray();

        return $this->response->setJSON([
            'data' => array_map([AnnouncementPresenter::class, 'fromRow'], $rows),
            'meta' => ['page' => $page, 'page_size' => $size, 'total' => $total],
        ]);
    }

    public function show(string $slug): ResponseInterface
    {
        $this->applyCors();
        $row = $this->publishedBuilder()->where('slug', $slug)->get()->getRowArray();
        if ($row === null) {
            return $this->response->setStatusCode(404)->setJSON(['error' => 'not_found']);
        }

        return $this->response->setJSON([
            'data' => AnnouncementPresenter::fromRow($row),
        ]);
    }

    private function publishedBuilder(): BaseBuilder
    {
        return model(AnnouncementModel::class)->builder()->where('state', 'published');
    }

    private function applyFilters(BaseBuilder $builder): void
    {
        $category = trim((string) ($this->request->getGet('category') ?? ''));
        if ($category !== '') {
            $builder->where('category', $category);
        }

        $q = trim((string) ($this->request->getGet('q') ?? ''));
        if ($q !== '') {
            $builder->groupStart()
                ->like('title', $q)
                ->orLike('summary', $q)
                ->groupEnd();
        }

        $from = trim((string) ($this->request->getGet('date_from') ?? ''));
        if ($from !== '') {
            $builder->where('filed_at >=', $from);
        }

        $to = trim((string) ($this->request->getGet('date_to') ?? ''));
        if ($to !== '') {
            $builder->where('filed_at <=', $to);
        }
    }

    private function applyCors(): void
    {
        $origin = $this->request->getHeaderLine('Origin');
        $this->response->removeHeader('Access-Control-Allow-Origin');
        if ($origin !== '' && in_array($origin, config('Sgx')->corsOrigins, true)) {
            $this->response->setHeader('Access-Control-Allow-Origin', $origin);
        }
    }
}
