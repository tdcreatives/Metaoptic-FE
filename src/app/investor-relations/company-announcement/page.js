import React from 'react';

import metadataJson from '@/constants/metadata.json';

import InvestorRelationsBanner from '@/layouts/investor-relations/banner';
import InvestorRelationsTabBar from '@/layouts/investor-relations/tab-bar';
import Announcements from '@/layouts/investor-relations/announcements';

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

const CompanyAnnouncementPage = () => (
    <>
        <InvestorRelationsBanner bannerTitle='INVESTOR<br/>RELATIONS(SGX)' />
        <InvestorRelationsTabBar />
        <Announcements />
    </>
);

export default CompanyAnnouncementPage;
