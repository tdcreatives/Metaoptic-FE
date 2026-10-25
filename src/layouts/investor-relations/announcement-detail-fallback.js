'use client';

import React, { useEffect, useState } from 'react';

import items from '@/constants/announcements.json';
import { IR_LAUNCH_FLAGS } from '@/constants/ir-feature-flags';
import {
    fetchAnnouncementBySlug,
    mapApiAnnouncementToLegacy,
} from '@/lib/announcements-api';
import AnnouncementBanner from '@/layouts/investor-relations/announcement-banner';
import AnnouncementDetailContent from '@/layouts/investor-relations/announcement-detail-content';
import InvestorRelationsTabBar from '@/layouts/investor-relations/tab-bar';

function slugFromPathname(pathname) {
    const parts = String(pathname || '')
        .split('/')
        .filter(Boolean);
    const last = parts[parts.length - 1] || '';
    // Ignore the static fallback segment if the rewrite URL somehow leaks through.
    if (last === 'company-announcement-fallback') {
        return '';
    }
    return last;
}

/**
 * Client detail shell for Cloudflare Pages `_redirects` SPA fallback.
 * Used when static export has no HTML for an API-only slug.
 *
 * Slug comes from window.location (not next/navigation): CF 200 rewrites keep the
 * browser URL on /…/company-announcement/:slug while serving fallback HTML.
 */
export default function AnnouncementDetailFallback({ showTabBar = true } = {}) {
    const [slug, setSlug] = useState('');
    const [announcement, setAnnouncement] = useState(null);
    const [status, setStatus] = useState('loading');

    useEffect(() => {
        const fromLocation = slugFromPathname(window.location.pathname);
        setSlug(fromLocation);
        if (!fromLocation) {
            setStatus('missing');
        }
    }, []);

    useEffect(() => {
        if (!slug) {
            return undefined;
        }
        const fromJson = items.find((item) => item.slug === slug);
        if (fromJson) {
            setAnnouncement(fromJson);
            setStatus('ready');
            return undefined;
        }
        if (!IR_LAUNCH_FLAGS.useAnnouncementsApi) {
            setAnnouncement(null);
            setStatus('missing');
            return undefined;
        }

        let cancelled = false;
        setStatus('loading');
        fetchAnnouncementBySlug(slug)
            .then((row) => {
                if (cancelled) return;
                setAnnouncement(mapApiAnnouncementToLegacy(row));
                setStatus('ready');
            })
            .catch(() => {
                if (!cancelled) {
                    setAnnouncement(null);
                    setStatus('missing');
                }
            });

        return () => {
            cancelled = true;
        };
    }, [slug]);

    if (status === 'loading') {
        return (
            <>
                <AnnouncementBanner bannerTitle="INVESTOR<br/>RELATIONS" />
                {showTabBar ? <InvestorRelationsTabBar /> : null}
                <div className="flex flex-col items-center justify-center min-h-[400px] bg-[#EAEAEA]">
                    <p className="text-gray-600">Loading announcement…</p>
                </div>
            </>
        );
    }

    return (
        <>
            <AnnouncementBanner bannerTitle={announcement?.title_banner} />
            {showTabBar ? <InvestorRelationsTabBar /> : null}
            <AnnouncementDetailContent announcement={announcement} />
        </>
    );
}
