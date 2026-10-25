<?php
declare(strict_types=1);

namespace Tests\Unit\Email;

use App\Libraries\Email\EmailNormalizer;
use CodeIgniter\Test\CIUnitTestCase;
use InvalidArgumentException;

final class EmailNormalizerTest extends CIUnitTestCase
{
    public function test_normalize_trims_and_lowers(): void
    {
        $this->assertSame('ir@metaoptics.sg', (new EmailNormalizer())->normalize('  IR@MetaOptics.SG  '));
    }

    public function test_normalize_rejects_invalid(): void
    {
        $this->expectException(InvalidArgumentException::class);
        (new EmailNormalizer())->normalize('not-an-email');
    }
}
