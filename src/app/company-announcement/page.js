import React from 'react';

import { buildPageMetadataFromSection } from '@/lib/seo';

import Header from '@/layouts/main/header';
import Footer from '@/layouts/main/footer';
import News from '@/layouts/homepage/news';
import Announcements from '@/layouts/investor-relations/announcements';
import CompanyAnnouncementBanner from '@/layouts/investor-relations/company-announcement-banner';

export const metadata = buildPageMetadataFromSection('companyAnnouncements');

const CompanyAnnouncement = () => {
    return (
        <>
            <Header />
            <CompanyAnnouncementBanner />
            <Announcements />
            <News />
            <Footer />
        </>
    );
};

export default CompanyAnnouncement;
