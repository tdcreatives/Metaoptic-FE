import React from 'react';
import { buildIrPageMetadata } from '@/lib/seo';
import InvestorRelationsBanner from '@/layouts/investor-relations/banner';
import InvestorRelationsTabBar from '@/layouts/investor-relations/tab-bar';
import MediaList from '@/layouts/investor-relations/news/media-list';

export const metadata = buildIrPageMetadata('media');

const MediaPage = () => {
    return (
        <>
            <InvestorRelationsBanner bannerTitle='NEWS' />
            <InvestorRelationsTabBar />
            <MediaList />
        </>
    );
};

export default MediaPage;
