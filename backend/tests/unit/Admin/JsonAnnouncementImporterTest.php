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
        $this->assertSame([], $result['skipped_refs']);

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
        $this->assertSame(
            [['slug' => 'dup-ref-second', 'reference' => 'SG-DUP-SHARED-REF']],
            $result['skipped_refs']
        );
    }

    public function test_update_preserves_curated_fields_unless_force(): void
    {
        $path = SUPPORTPATH . 'Fixtures/announcements/fe-parity-one.json';
        $importer = new JsonAnnouncementImporter(db_connect());
        $importer->import($path);

        $model = model(AnnouncementModel::class);
        $row = $model->where(
            'slug',
            'general-announcement-press-release-mot-announces-s1-1m-placement-for-full-automation-of-metalens-camera-modules-assembly'
        )->first();
        $model->update((int) $row['id'], [
            'state' => 'archived',
            'needs_review' => 1,
            'summary' => 'Admin curated',
            'title_banner' => 'ADMIN<br/>BANNER',
            'title_btn' => 'Admin btn',
            'title_btn_sm' => 'Admin sm',
        ]);

        $importer->import($path);
        $again = $model->find((int) $row['id']);
        $this->assertSame('archived', $again['state']);
        $this->assertSame(1, (int) $again['needs_review']);
        $this->assertSame('Admin curated', $again['summary']);
        $this->assertSame('ADMIN<br/>BANNER', $again['title_banner']);
        $this->assertSame('Admin btn', $again['title_btn']);
        $this->assertSame('Admin sm', $again['title_btn_sm']);

        $importer->import($path, true);
        $forced = $model->find((int) $row['id']);
        $this->assertSame('published', $forced['state']);
        $this->assertSame(0, (int) $forced['needs_review']);
        $this->assertSame('', $forced['summary']);
        $this->assertSame('GENERAL<br/>ANNOUNCEMENT', $forced['title_banner']);
    }

    public function test_import_writes_audit_once_per_run(): void
    {
        $path = SUPPORTPATH . 'Fixtures/announcements/fe-parity-one.json';
        (new JsonAnnouncementImporter(db_connect()))->import($path);

        $logs = db_connect()->table('audit_log')->where('action', 'import_json')->get()->getResultArray();
        $this->assertCount(1, $logs);
        $this->assertSame('announcement', $logs[0]['entity_type']);
    }
}
