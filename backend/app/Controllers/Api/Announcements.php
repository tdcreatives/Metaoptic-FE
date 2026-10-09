<?php
declare(strict_types=1);

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Libraries\Admin\AnnouncementPreviewToken;
use App\Libraries\Sgx\AnnouncementDetailHydrator;
use App\Libraries\Sgx\AnnouncementPresenter;
use App\Libraries\Http\CorsHeaders;
use App\Models\AnnouncementModel;
use CodeIgniter\Database\BaseBuilder;
use CodeIgniter\HTTP\ResponseInterface;
use InvalidArgumentException;

class Announcements extends BaseController
{
    public function index(): ResponseInterface
    {
        CorsHeaders::apply($this->request, $this->response);
        $page = max(1, (int) ($this->request->getGet('page') ?? 1));
        // Cap 100: FE list loops pages until meta.total; keep a bound on a single request.
        $size = min(100, max(1, (int) ($this->request->getGet('page_size') ?? 10)));
        $builder = $this->publishedBuilder();
        $this->applyFilters($builder);

        $total = $builder->countAllResults(false);
        $rows = $builder->orderBy('filed_at', 'DESC')->limit($size, ($page - 1) * $size)->get()->getResultArray();

        return $this->response->setJSON([
            'data' => array_map(
                static fn (array $row): array => AnnouncementPresenter::fromRow(AnnouncementDetailHydrator::hydrate($row)),
                $rows
            ),
            'meta' => ['page' => $page, 'page_size' => $size, 'total' => $total],
        ]);
    }

    public function show(string $slug): ResponseInterface
    {
        CorsHeaders::apply($this->request, $this->response);
        $row = $this->publishedBuilder()->where('slug', $slug)->get()->getRowArray();
        if ($row === null) {
            return $this->response->setStatusCode(404)->setJSON(['error' => 'not_found']);
        }

        $row = AnnouncementDetailHydrator::hydrate($row);

        return $this->response->setJSON([
            'data' => AnnouncementPresenter::fromRow($row),
        ]);
    }

    /** Signed-token preview of unpublished (or any) announcement — not listed publicly. */
    public function preview(): ResponseInterface
    {
        CorsHeaders::apply($this->request, $this->response);
        $token = trim((string) ($this->request->getGet('t') ?? ''));
        if ($token === '') {
            return $this->response->setStatusCode(404)->setJSON(['error' => 'not_found']);
        }

        try {
            $id = AnnouncementPreviewToken::fromConfig()->parse($token);
        } catch (InvalidArgumentException $e) {
            $msg = $e->getMessage();
            if (str_contains($msg, 'preview secret')) {
                return $this->response->setStatusCode(503)->setJSON(['error' => 'preview_unavailable']);
            }
            $code = $msg === 'expired' ? 410 : 404;

            return $this->response->setStatusCode($code)->setJSON(['error' => $msg]);
        }

        $row = model(AnnouncementModel::class)->find($id);
        if ($row === null) {
            return $this->response->setStatusCode(404)->setJSON(['error' => 'not_found']);
        }

        $row = AnnouncementDetailHydrator::hydrate($row);

        return $this->response->setJSON([
            'data' => AnnouncementPresenter::fromRow($row),
            'meta' => [
                'preview' => true,
                'state' => (string) ($row['state'] ?? ''),
            ],
        ]);
    }

    private function publishedBuilder(): BaseBuilder
    {
        // Live website only — CMS-published but not yet "Publish to live site" stays hidden
        return model(AnnouncementModel::class)->builder()
            ->where('state', 'published')
            ->where('live_at IS NOT NULL', null, false);
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
            // Date-only YYYY-MM-DD must include that calendar day (SQL datetime vs date truncates to 00:00:00).
            if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $to) === 1) {
                $builder->where('filed_at <', (new \DateTimeImmutable($to))->modify('+1 day')->format('Y-m-d'));
            } else {
                $builder->where('filed_at <=', $to);
            }
        }
    }

}
