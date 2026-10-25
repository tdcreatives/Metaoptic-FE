<?php
declare(strict_types=1);

namespace Tests\Feature\Admin;

use CodeIgniter\Test\CIUnitTestCase;
use CodeIgniter\Test\FeatureTestTrait;

final class HomeRedirectTest extends CIUnitTestCase
{
    use FeatureTestTrait;

    public function test_root_redirects_to_admin(): void
    {
        $this->get('/')->assertRedirectTo('/admin');
    }
}
