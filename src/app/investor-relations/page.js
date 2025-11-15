import React from 'react';

import metadataJson from '@/constants/metadata.json';

import Header from '@/layouts/main/header';
import Footer from '@/layouts/main/footer';
import News from '@/layouts/homepage/news';
import Announcements from '@/layouts/investor-relations/announcements';
import InvestorRelationsBanner from '@/layouts/investor-relations/banner';


export const metadata = {
    title: metadataJson.investorrelations.title,
    description: metadataJson.investorrelations.description,
    keywords: metadataJson.investorrelations.keywords,
    openGraph: {
        images: [metadataJson.investorrelations.ogImage],
        url: metadataJson.investorrelations.ogUrl,
        type: metadataJson.investorrelations.ogType,
        siteName: metadataJson.investorrelations.ogSiteName,
        locale: metadataJson.investorrelations.ogLocale,
    },
    twitter: {
        card: metadataJson.investorrelations.twitterCard,
        creator: metadataJson.investorrelations.twitterCreator,
        site: metadataJson.investorrelations.twitterSite,
        title: metadataJson.investorrelations.twitterTitle,
        description: metadataJson.investorrelations.twitterDescription,
    },
};

const InvestorRelations = () => {
    return (
        <>
            <Header />
            <InvestorRelationsBanner />
            <Announcements />
            <News />
            <Footer />
        </>
    );
};

export default InvestorRelations;
