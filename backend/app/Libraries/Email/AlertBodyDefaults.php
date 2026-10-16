<?php
declare(strict_types=1);

namespace App\Libraries\Email;

/** Default WYSIWYG body for new Email Alert compose / drafts. */
final class AlertBodyDefaults
{
    public static function sampleHtml(): string
    {
        return '<p>Dear Investor,</p>'
            . '<p>We are pleased to share the following MetaOptics company announcement(s):</p>'
            . '<p>{{announcement}}</p>'
            . '<p>Thank you for your continued interest in MetaOptics Ltd.</p>'
            . '<p>Best regards,<br>MetaOptics Investor Relations</p>';
    }
}
