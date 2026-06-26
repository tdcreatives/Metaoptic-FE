import React from 'react';
import { buildIrPageMetadata } from '@/lib/seo';
import InvestorRelationsBanner from '@/layouts/investor-relations/banner';
import InvestorRelationsTabBar from '@/layouts/investor-relations/tab-bar';
import PressReleasesList from '@/layouts/investor-relations/news/press-releases-list';

export const metadata = buildIrPageMetadata('pressReleases');

const PressReleasesPage = () => {
    return (
        <>
            <InvestorRelationsBanner bannerTitle='NEWS' />
            <InvestorRelationsTabBar />
            <PressReleasesList />
        </>
    );
};

export default PressReleasesPage;
