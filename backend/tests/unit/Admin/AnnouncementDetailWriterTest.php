<?php
declare(strict_types=1);

namespace Tests\Unit\Admin;

use App\Libraries\Admin\AnnouncementDetailWriter;
use App\Libraries\Sgx\AnnouncementDetailHydrator;
use CodeIgniter\Test\CIUnitTestCase;
use CodeIgniter\Test\DatabaseTestTrait;

final class AnnouncementDetailWriterTest extends CIUnitTestCase
{
    use DatabaseTestTrait;

    protected $migrate = true;
    protected $refresh = true;
    protected $namespace = 'App';

    public function test_replace_writes_children_and_hydrator_rereads_them(): void
    {
        $db = db_connect();
        $db->table('announcements')->insert([
            'sgx_reference' => 'SG260911OTHR4TNS',
            'slug' => 'press-release',
            'source_url' => '',
            'title' => 'Press Release',
            'category' => 'General Announcement',
            'issuer' => 'METAOPTICS LTD',
            'filed_at' => '2026-09-11 20:43:00',
            'source_payload' => '{}',
            'source_hash' => str_repeat('a', 64),
            'source' => 'sgx',
            'state' => 'published',
            'needs_review' => 0,
        ]);
        $id = (int) $db->insertID();

        (new AnnouncementDetailWriter($db))->replace(
            $id,
            ['ann_reference' => 'SG260911OTHR4TNS', 'issuer_name' => 'METAOPTICS LTD'],
            [['name' => 'Press.pdf', 'url' => 'https://links.sgx.com/x', 'sort_order' => 0]],
            [],
            [['section' => 'additional_left', 'name' => 'Capital Amount-Old:', 'text' => 'SGD 9', 'sort_order' => 0]],
        );

        $this->assertSame(1, $db->table('announcement_attachments')->where('announcement_id', $id)->countAllResults());
        $this->assertSame(1, $db->table('announcement_labeled_rows')->where('announcement_id', $id)->countAllResults());
        $this->assertSame(0, $db->table('announcement_related')->where('announcement_id', $id)->countAllResults());

        $row = $db->table('announcements')->where('id', $id)->get()->getRowArray();
        $hydrated = AnnouncementDetailHydrator::hydrate($row);
        $this->assertSame('SG260911OTHR4TNS', $hydrated['ann_reference']);
        $this->assertSame('METAOPTICS LTD', $hydrated['issuer_name']);
        $this->assertCount(1, $hydrated['_attachments']);
        $this->assertSame('Press.pdf', $hydrated['_attachments'][0]['name']);
        $this->assertCount(1, $hydrated['_labeled_rows']);
        $this->assertSame('additional_left', $hydrated['_labeled_rows'][0]['section']);
        $this->assertSame([], $hydrated['_related']);

        (new AnnouncementDetailWriter($db))->replace(
            $id,
            [
                'ann_reference' => 'SG260911OTHR4TNS',
                'issuer_name' => 'METAOPTICS LTD',
                'state' => 'pending_review',
                'slug' => 'hijacked',
                'source_hash' => str_repeat('b', 64),
                'title' => 'Hijacked',
                'category' => 'Hijacked',
            ],
            [['name' => 'Other.pdf', 'url' => 'https://links.sgx.com/y', 'sort_order' => 0]],
            [],
            [],
        );

        $rowAfter = $db->table('announcements')->where('id', $id)->get()->getRowArray();
        $this->assertSame('published', $rowAfter['state']);
        $this->assertSame('press-release', $rowAfter['slug']);
        $this->assertSame(str_repeat('a', 64), $rowAfter['source_hash']);
        $this->assertSame('Press Release', $rowAfter['title']);
        $this->assertSame('General Announcement', $rowAfter['category']);

        $attachments = $db->table('announcement_attachments')->where('announcement_id', $id)->get()->getResultArray();
        $this->assertCount(1, $attachments);
        $this->assertSame('Other.pdf', $attachments[0]['name']);
        $this->assertSame(0, $db->table('announcement_labeled_rows')->where('announcement_id', $id)->countAllResults());
    }
}
