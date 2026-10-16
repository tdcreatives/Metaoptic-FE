<?php
declare(strict_types=1);

namespace App\Libraries\Admin;

/**
 * Maps CMS row fields to redesign workflow labels (Needs review / Ready / Live / …).
 *
 * Locked rules:
 * - Needs review = state pending_review only
 * - Ready to publish = needs_review=1 (when not pending) OR published without live_at
 * - Live on site = published + live_at + needs_review=0
 */
final class AnnouncementWorkflowStatus
{
    public const NEEDS_REVIEW = 'needs_review';
    public const READY = 'ready';
    public const LIVE = 'live';
    public const ARCHIVED = 'archived';
    public const DRAFT = 'draft';
    public const OTHER = 'other';

    /** @param array<string, mixed> $row */
    public static function key(array $row): string
    {
        $state = (string) ($row['state'] ?? '');
        $needsReview = (int) ($row['needs_review'] ?? 0) === 1;
        $hasLive = ($row['live_at'] ?? null) !== null && ($row['live_at'] ?? '') !== '';

        if ($state === 'pending_review') {
            return self::NEEDS_REVIEW;
        }

        if ($state === 'archived') {
            return self::ARCHIVED;
        }

        if ($state === 'draft') {
            return self::DRAFT;
        }

        if ($state === 'published') {
            if ($needsReview || ! $hasLive) {
                return self::READY;
            }

            return self::LIVE;
        }

        return self::OTHER;
    }

    /** @param array<string, mixed> $row */
    public static function label(array $row): string
    {
        return match (self::key($row)) {
            self::NEEDS_REVIEW => 'Needs review',
            self::READY => 'Ready to publish',
            self::LIVE => 'Live on site',
            self::ARCHIVED => 'Archived',
            self::DRAFT => 'Draft',
            default => $row['state'] ?? 'Unknown',
        };
    }

    /** CSS pill modifier: amber|blue|green|grey */
    public static function pillClass(array $row): string
    {
        return match (self::key($row)) {
            self::NEEDS_REVIEW => 'amber',
            self::READY => 'blue',
            self::LIVE => 'green',
            default => 'grey',
        };
    }

    /** Segment query value → SQL constraints applied by controller. */
    public static function isSegment(string $segment): bool
    {
        return in_array($segment, ['needs_review', 'ready', 'live', 'archived', ''], true);
    }
}
