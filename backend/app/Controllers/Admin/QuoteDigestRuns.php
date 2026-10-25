<?php
declare(strict_types=1);

namespace App\Controllers\Admin;

use App\Controllers\BaseController;
use App\Models\QuoteDigestRunModel;
use CodeIgniter\Exceptions\PageNotFoundException;

class QuoteDigestRuns extends BaseController
{
    public function index(): string
    {
        return view('admin/quote_digest_runs/index', [
            'title' => 'Daily stock digest',
            'runs' => model(QuoteDigestRunModel::class)->orderBy('digest_date', 'DESC')->findAll(100),
        ]);
    }

    public function show(int $id): string
    {
        $run = model(QuoteDigestRunModel::class)->find($id);
        if ($run === null) {
            throw PageNotFoundException::forPageNotFound();
        }

        return view('admin/quote_digest_runs/show', [
            'title' => 'Daily stock digest — ' . ($run['digest_date'] ?? ''),
            'run' => $run,
            'quotePretty' => $this->prettyJson(isset($run['quote_json']) ? (string) $run['quote_json'] : ''),
        ]);
    }

    private function prettyJson(string $raw): string
    {
        if ($raw === '') {
            return '';
        }
        $decoded = json_decode($raw, true);
        if (! is_array($decoded)) {
            return $raw;
        }

        return (string) json_encode($decoded, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR);
    }
}
