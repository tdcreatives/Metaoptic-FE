import React from 'react';

import metadataJson from '@/constants/metadata.json';

import VisMetalensClientSide from './VisMetalensClientSide';

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

const VisMetalensPage = () => {
    return <VisMetalensClientSide />;
};

export default VisMetalensPage;
