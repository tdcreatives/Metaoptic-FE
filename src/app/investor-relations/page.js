import React from 'react';

import metadataJson from '@/constants/metadata.json';

import Header from '@/layouts/main/header';
import Footer from '@/layouts/main/footer';
import News from '@/layouts/homepage/news';
import AnnualInterimReport from '@/layouts/investor-relations/annual-interim-report';
import InvestorRelationsBanner from '@/layouts/investor-relations/banner';


export const metadata = {
    title: metadataJson.investorrelations.title,
    description: metadataJson.investorrelations.description,
    keywords: metadataJson.investorrelations.keywords,
    ogImage: metadataJson.investorrelations.ogImage,
    ogUrl: metadataJson.investorrelations.ogUrl,
    ogType: metadataJson.investorrelations.ogType,
    ogSiteName: metadataJson.investorrelations.ogSiteName,
    ogLocale: metadataJson.investorrelations.ogLocale,
    twitterCard: metadataJson.investorrelations.twitterCard,
    twitterCreator: metadataJson.investorrelations.twitterCreator,
    twitterSite: metadataJson.investorrelations.twitterSite,
    twitterTitle: metadataJson.investorrelations.twitterTitle,
    twitterDescription: metadataJson.investorrelations.twitterDescription,
};

const InvestorRelations = () => {
    return (
        <>
            <Header />
            <InvestorRelationsBanner />
            <AnnualInterimReport />
            <News />
            <Footer />
        </>
    );
};

export default InvestorRelations;
