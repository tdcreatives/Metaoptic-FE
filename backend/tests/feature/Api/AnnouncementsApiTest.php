<?php
declare(strict_types=1);

namespace Tests\Feature\Api;

use App\Models\AnnouncementModel;
use CodeIgniter\Test\CIUnitTestCase;
use CodeIgniter\Test\DatabaseTestTrait;
use CodeIgniter\Test\FeatureTestTrait;

final class AnnouncementsApiTest extends CIUnitTestCase
{
    use DatabaseTestTrait;
    use FeatureTestTrait;

    protected $migrate = true;
    protected $refresh = true;
    protected $namespace = 'App';

    public function test_index_returns_only_published_and_omits_secrets(): void
    {
        $this->seedPair();

        $result = $this->get('/api/announcements');
        $result->assertOK();

        $json = json_decode((string) $result->getJSON(), true);
        $this->assertIsArray($json);
        $this->assertCount(1, $json['data']);
        $this->assertSame('published-mou', $json['data'][0]['slug']);
        $this->assertSame('15 Sep 2025 09:30 AM', $json['data'][0]['date']);
        $this->assertSame('GENERAL<br/>ANNOUNCEMENT', $json['data'][0]['title_banner']);
        $this->assertSame('SGXPUB', $json['data'][0]['details']['announcement']['reference']);
        $this->assertSame(['page' => 1, 'page_size' => 10, 'total' => 1], $json['meta']);
        $this->assertSame(
            ['id', 'title', 'title_btn', 'title_btn_sm', 'title_banner', 'slug', 'desc', 'date', 'details', 'category'],
            array_keys($json['data'][0])
        );
        $this->assertArrayNotHasKey('filed_at', $json['data'][0]);
        $this->assertArrayNotHasKey('published_at', $json['data'][0]);
        $this->assertArrayNotHasKey('source_url', $json['data'][0]);
        $this->assertArrayNotHasKey('summary', $json['data'][0]);
        $this->assertArrayNotHasKey('source_payload', $json['data'][0]);
        $this->assertArrayNotHasKey('source_hash', $json['data'][0]);
        $this->assertArrayNotHasKey('needs_review', $json['data'][0]);
        $this->assertArrayNotHasKey('state', $json['data'][0]);
        $this->assertArrayNotHasKey('email_subject', $json['data'][0]);
        $this->assertArrayNotHasKey('email_intro', $json['data'][0]);
    }

    public function test_show_by_slug_and_hides_pending(): void
    {
        $this->seedPair();

        $ok = $this->get('/api/announcements/published-mou');
        $ok->assertOK();
        $json = json_decode((string) $ok->getJSON(), true);
        $this->assertSame('published-mou', $json['data']['slug']);
        $this->assertArrayNotHasKey('source_payload', $json['data']);

        $this->get('/api/announcements/pending-results')->assertStatus(404);
    }

    public function test_filters_category_q_and_dates(): void
    {
        $this->insertRow([
            'sgx_reference' => 'PUB1',
            'slug' => 'fin-results',
            'title' => 'Half Year Results',
            'category' => 'Financial Statements',
            'filed_at' => '2025-09-15 09:30:00',
            'summary' => 'Revenue up',
            'state' => 'published',
        ]);
        $this->insertRow([
            'sgx_reference' => 'PUB2',
            'slug' => 'personnel-change',
            'title' => 'Board Appointment',
            'category' => 'Personnel Changes',
            'filed_at' => '2025-01-02 10:00:00',
            'summary' => 'Director joins',
            'state' => 'published',
        ]);

        $byCat = json_decode((string) $this->get('/api/announcements?category=Financial%20Statements')->getJSON(), true);
        $this->assertSame(1, $byCat['meta']['total']);
        $this->assertSame('fin-results', $byCat['data'][0]['slug']);

        $byQ = json_decode((string) $this->get('/api/announcements?q=Appointment')->getJSON(), true);
        $this->assertSame(1, $byQ['meta']['total']);
        $this->assertSame('personnel-change', $byQ['data'][0]['slug']);

        $byDate = json_decode(
            (string) $this->get('/api/announcements?date_from=2025-09-01&date_to=2025-09-30')->getJSON(),
            true
        );
        $this->assertSame(1, $byDate['meta']['total']);
        $this->assertSame('fin-results', $byDate['data'][0]['slug']);
    }

    public function test_date_to_includes_filed_at_on_that_calendar_day(): void
    {
        $this->insertRow([
            'sgx_reference' => 'EOD1',
            'slug' => 'filed-on-date-to',
            'title' => 'Filed late on date_to',
            'category' => 'General Announcement',
            'filed_at' => '2025-09-30 18:45:00',
            'state' => 'published',
        ]);

        $json = json_decode(
            (string) $this->get('/api/announcements?date_to=2025-09-30')->getJSON(),
            true
        );
        $this->assertSame(1, $json['meta']['total']);
        $this->assertSame('filed-on-date-to', $json['data'][0]['slug']);
    }

    public function test_cors_allows_configured_origin(): void
    {
        $this->seedPair();
        $origin = config('Sgx')->corsOrigins[0] ?? 'https://metaoptics.sg';

        $allowed = $this->withHeaders(['Origin' => $origin])->get('/api/announcements');
        $allowed->assertOK();
        $allowed->assertHeader('Access-Control-Allow-Origin', $origin);

        $denied = $this->withHeaders(['Origin' => 'https://evil.example'])->get('/api/announcements');
        $denied->assertOK();
        $denied->assertHeaderMissing('Access-Control-Allow-Origin');
    }

    public function test_page_size_is_capped_at_100(): void
    {
        $this->seedPair();
        $json = json_decode((string) $this->get('/api/announcements?page_size=200')->getJSON(), true);
        $this->assertSame(100, $json['meta']['page_size']);
    }

    private function seedPair(): void
    {
        $this->insertRow([
            'sgx_reference' => 'SGXPUB',
            'slug' => 'published-mou',
            'title' => 'METAOPTICS ENTERS MOU',
            'category' => 'General Announcement',
            'filed_at' => '2025-09-15 09:30:00',
            'state' => 'published',
            'published_at' => '2025-09-15 10:00:00',
        ]);
        $this->insertRow([
            'sgx_reference' => 'SGXPEN',
            'slug' => 'pending-results',
            'title' => 'Pending Results',
            'category' => 'Financial Statements',
            'filed_at' => '2025-09-16 09:30:00',
            'state' => 'pending_review',
        ]);
    }

    /** @param array<string, mixed> $overrides */
    private function insertRow(array $overrides): void
    {
        (new AnnouncementModel())->insert(array_merge([
            'source_url' => 'https://example.test/a',
            'issuer' => 'MetaOptics Ltd',
            'source_payload' => '{"secret":true}',
            'source_hash' => str_repeat('b', 64),
            'summary' => null,
            'needs_review' => 1,
        ], $overrides));
    }
}
