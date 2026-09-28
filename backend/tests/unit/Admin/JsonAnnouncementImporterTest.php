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
        $result = (new JsonAnnouncementImporter(db_connect()))->import($path);
        $this->assertSame(1, $result['inserted'] + $result['updated']);
        $row = model(AnnouncementModel::class)->where(
            'slug',
            'general-announcement-press-release-mot-announces-s1-1m-placement-for-full-automation-of-metalens-camera-modules-assembly'
        )->first();
        $this->assertSame('published', $row['state']);
        $hydrated = AnnouncementDetailHydrator::hydrate($row);
        $out = AnnouncementPresenter::fromRow($hydrated);
        $this->assertSame('SG260911OTHR4TNS', $out['details']['announcement']['reference']);
        $this->assertNotEmpty($out['details']['attachments']);
    }
}
