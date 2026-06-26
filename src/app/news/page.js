import React from 'react';
import { buildPageMetadataFromSection } from '@/lib/seo';

import NewsClientSide from './NewsClientSide';

export const metadata = buildPageMetadataFromSection('news');

const News = () => {
    return <NewsClientSide />;
};

export default News;
