import React from 'react';

import metadataJson from '@/constants/metadata.json';

import FoundaryOverviewClientSide from './FoundaryOverviewClientSide';

export const metadata = {
    title: metadataJson.products.title,
    description: metadataJson.products.description,
    keywords: metadataJson.products.keywords,
    openGraph: {
        images: [metadataJson.products.ogImage],
        url: metadataJson.products.ogUrl,
        type: metadataJson.products.ogType,
        siteName: metadataJson.products.ogSiteName,
        locale: metadataJson.products.ogLocale,
    },
    twitter: {
        card: metadataJson.products.twitterCard,
        creator: metadataJson.products.twitterCreator,
        site: metadataJson.products.twitterSite,
        title: metadataJson.products.twitterTitle,
        description: metadataJson.products.twitterDescription,
    },
};

const FoundaryOverviewPage = () => {
    return <FoundaryOverviewClientSide />;
};

export default FoundaryOverviewPage;
