import Header from '@/layouts/main/header';
import Footer from '@/layouts/main/footer';
import AnnouncementDetailFallback from '@/layouts/investor-relations/announcement-detail-fallback';

export const metadata = {
    title: 'Company Announcement | Metaoptics Technologies',
    robots: { index: false, follow: true },
};

/** Legacy path SPA shell; prefer /investor-relations/company-announcement/:slug. */
export default function CompanyAnnouncementLegacyFallbackPage() {
    return (
        <>
            <Header />
            <AnnouncementDetailFallback showTabBar={false} />
            <Footer />
        </>
    );
}
