<?php
declare(strict_types=1);

namespace Tests\Unit\Sgx;

use App\Libraries\Sgx\LayoutTitleDeriver;
use CodeIgniter\Test\CIUnitTestCase;

final class LayoutTitleDeriverTest extends CIUnitTestCase
{
    public function test_banner_derives_from_category(): void
    {
        $this->assertSame(
            'GENERAL<br/>ANNOUNCEMENT',
            LayoutTitleDeriver::bannerFromCategory('General Announcement')
        );
    }

    public function test_banner_splits_on_first_space(): void
    {
        $this->assertSame(
            'DISCLOSURE<br/>OF INTEREST',
            LayoutTitleDeriver::bannerFromCategory('Disclosure of Interest')
        );
    }

    public function test_banner_single_word_has_no_break(): void
    {
        $this->assertSame('PLACEMENTS', LayoutTitleDeriver::bannerFromCategory('Placements'));
    }

    public function test_btn_from_title_is_title_without_forced_breaks(): void
    {
        $title = 'GENERAL ANNOUNCEMENT::PRESS RELEASE-MOT';
        $this->assertSame($title, LayoutTitleDeriver::btnFromTitle($title));
    }
}
