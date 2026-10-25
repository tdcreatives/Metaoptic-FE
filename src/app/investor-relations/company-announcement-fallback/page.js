import AnnouncementDetailFallback from '@/layouts/investor-relations/announcement-detail-fallback';

export const metadata = {
    title: 'Company Announcement | Metaoptics Technologies',
    robots: { index: false, follow: true },
};

/** SPA shell for CF `_redirects` when an API-only slug has no static HTML. */
export default function CompanyAnnouncementFallbackPage() {
    return <AnnouncementDetailFallback showTabBar />;
}
