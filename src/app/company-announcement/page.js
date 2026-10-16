import React from 'react';

import metadataJson from '@/constants/metadata.json';

import Header from '@/layouts/main/header';
import Footer from '@/layouts/main/footer';
import News from '@/layouts/homepage/news';
import Announcements from '@/layouts/investor-relations/announcements';
import CompanyAnnouncementBanner from '@/layouts/investor-relations/company-announcement-banner';

const meta = metadataJson.companyAnnouncements;

export const metadata = {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    openGraph: {
        title: meta.title,
        description: meta.description,
        images: [meta.ogImage],
        url: meta.ogUrl,
        type: meta.ogType,
        siteName: meta.ogSiteName,
        locale: meta.ogLocale,
    },
    twitter: {
        card: meta.twitterCard,
        creator: meta.twitterCreator,
        site: meta.twitterSite,
        title: meta.twitterTitle,
        description: meta.twitterDescription,
    },
};

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
