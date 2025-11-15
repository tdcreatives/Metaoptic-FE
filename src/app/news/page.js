import React from 'react';

import metadataJson from '@/constants/metadata.json';

import NewsClientSide from './NewsClientSide';

export const metadata = {
    title: metadataJson.news.title,
    description: metadataJson.news.description,
    keywords: metadataJson.news.keywords,
    openGraph: {
        images: [metadataJson.news.ogImage],
        url: metadataJson.news.ogUrl,
        type: metadataJson.news.ogType,
        siteName: metadataJson.news.ogSiteName,
        locale: metadataJson.news.ogLocale,
    },
    twitter: {
        card: metadataJson.news.twitterCard,
        creator: metadataJson.news.twitterCreator,
        site: metadataJson.news.twitterSite,
        title: metadataJson.news.twitterTitle,
        description: metadataJson.news.twitterDescription,
    },
};

const News = () => {
    return <NewsClientSide />;
};

export default News;
