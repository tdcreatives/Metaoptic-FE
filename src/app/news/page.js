import React from 'react';

import metadataJson from '@/constants/metadata.json';

import NewsClientSide from './NewsClientSide';

export const metadata = {
    title: metadataJson.news.title,
    description: metadataJson.news.description,
};

const News = () => {
    return <NewsClientSide />;
};

export default News;
