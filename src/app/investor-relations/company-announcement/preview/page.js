'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

import AnnouncementBanner from '@/layouts/investor-relations/announcement-banner';
import AnnouncementDetailContent from '@/layouts/investor-relations/announcement-detail-content';
import InvestorRelationsTabBar from '@/layouts/investor-relations/tab-bar';
import {
    fetchAnnouncementPreview,
    mapApiAnnouncementToLegacy,
} from '@/lib/announcements-api';

function PreviewBody() {
    const searchParams = useSearchParams();
    const token = searchParams.get('t') || '';
    const [announcement, setAnnouncement] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        if (!token) {
            setError('Missing preview token.');
            setLoading(false);
            return undefined;
        }

        setLoading(true);
        fetchAnnouncementPreview(token)
            .then(({ data }) => {
                if (cancelled) return;
                setAnnouncement(mapApiAnnouncementToLegacy(data));
                setError('');
            })
            .catch((err) => {
                if (cancelled) return;
                const status = err?.status;
                if (status === 410) {
                    setError('This preview link has expired. Open Preview again from the admin list.');
                } else {
                    setError('Preview not available. The link may be invalid or the announcement was removed.');
                }
                setAnnouncement(null);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [token]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[320px] px-6">
                <p className="text-gray-600">Loading preview…</p>
            </div>
        );
    }

    if (error || !announcement) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[320px] px-6 text-center">
                <h1 className="text-2xl font-semibold text-red-600 mb-2">Preview unavailable</h1>
                <p className="text-gray-600 max-w-md">{error || 'Announcement not found.'}</p>
            </div>
        );
    }

    return (
        <>
            <div
                role="status"
                className="w-full bg-amber-100 border-b border-amber-300 text-amber-950 text-center text-sm py-2 px-4"
            >
                Preview — not published. This page is not indexed and the link expires after ~30 minutes.
            </div>
            <AnnouncementBanner bannerTitle={announcement?.title_banner} />
            <InvestorRelationsTabBar />
            <AnnouncementDetailContent announcement={announcement} />
        </>
    );
}

export default function AnnouncementPreviewPage() {
    return (
        <Suspense
            fallback={
                <div className="flex flex-col items-center justify-center min-h-[320px] px-6">
                    <p className="text-gray-600">Loading preview…</p>
                </div>
            }
        >
            <PreviewBody />
        </Suspense>
    );
}
