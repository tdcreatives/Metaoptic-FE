import React from 'react';

import metadataJson from '@/constants/metadata.json';

import NewsClientSide from './NewsClientSide';

export const metadata = {
    title: metadataJson.news.title,
    description: metadataJson.news.description,
    keywords: metadataJson.news.keywords,
    ogImage: metadataJson.news.ogImage,
    ogUrl: metadataJson.news.ogUrl,
    ogType: metadataJson.news.ogType,
    ogSiteName: metadataJson.news.ogSiteName,
    ogLocale: metadataJson.news.ogLocale,
    twitterCard: metadataJson.news.twitterCard,
    twitterCreator: metadataJson.news.twitterCreator,
    twitterSite: metadataJson.news.twitterSite,
    twitterTitle: metadataJson.news.twitterTitle,
    twitterDescription: metadataJson.news.twitterDescription,
};

const News = () => {
    return <NewsClientSide />;
};

export default News;
