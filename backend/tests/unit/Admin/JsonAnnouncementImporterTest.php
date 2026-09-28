<?php
declare(strict_types=1);

namespace Tests\Unit\Admin;

use App\Libraries\Admin\JsonAnnouncementImporter;
use App\Libraries\Sgx\AnnouncementDetailHydrator;
use App\Libraries\Sgx\AnnouncementPresenter;
use App\Models\AnnouncementModel;
use CodeIgniter\Test\CIUnitTestCase;
use CodeIgniter\Test\DatabaseTestTrait;

final class JsonAnnouncementImporterTest extends CIUnitTestCase
{
    use DatabaseTestTrait;

    protected $migrate = true;
    protected $refresh = true;
    protected $namespace = 'App';

    public function test_import_fixture_publishes_and_presenter_matches_reference(): void
    {
        $path = SUPPORTPATH . 'Fixtures/announcements/fe-parity-one.json';
        $importer = new JsonAnnouncementImporter(db_connect());
        $result = $importer->import($path);
        $this->assertSame(1, $result['inserted']);
        $this->assertSame(0, $result['updated']);

        $row = model(AnnouncementModel::class)->where(
            'slug',
            'general-announcement-press-release-mot-announces-s1-1m-placement-for-full-automation-of-metalens-camera-modules-assembly'
        )->first();
        $this->assertSame('published', $row['state']);
        $this->assertSame('sgx', $row['source']);
        $this->assertSame('2026-09-11 20:43:00', $row['filed_at']);
        $this->assertSame('GENERAL<br/>ANNOUNCEMENT', $row['title_banner']);

        $hydrated = AnnouncementDetailHydrator::hydrate($row);
        $out = AnnouncementPresenter::fromRow($hydrated);
        $this->assertSame('SG260911OTHR4TNS', $out['details']['announcement']['reference']);
        $this->assertCount(1, $out['details']['attachments']);

        $again = $importer->import($path);
        $this->assertSame(0, $again['inserted']);
        $this->assertSame(1, $again['updated']);
        $this->assertSame(1, db_connect()->table('announcement_attachments')->countAllResults());
    }

    public function test_duplicate_json_reference_nulls_sgx_reference_on_second_slug(): void
    {
        $path = SUPPORTPATH . 'Fixtures/announcements/duplicate-sgx-ref.json';
        $result = (new JsonAnnouncementImporter(db_connect()))->import($path);
        $this->assertSame(2, $result['inserted']);

        $model = model(AnnouncementModel::class);
        $first = $model->where('slug', 'dup-ref-first')->first();
        $second = $model->where('slug', 'dup-ref-second')->first();

        $this->assertSame('SG-DUP-SHARED-REF', $first['sgx_reference']);
        $this->assertSame('SG-DUP-SHARED-REF', $first['ann_reference']);
        $this->assertNull($second['sgx_reference']);
        $this->assertSame('SG-DUP-SHARED-REF', $second['ann_reference']);
        $this->assertSame('sgx', $second['source']);
    }
}
