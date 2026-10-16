import React from 'react';
import InvestorRelationsBanner from '@/layouts/investor-relations/banner';
import InvestorRelationsTabBar from '@/layouts/investor-relations/tab-bar';
import PressReleasesList from '@/layouts/investor-relations/news/press-releases-list';

export const metadata = {
    title: 'Press Releases | Investor Relations | Metaoptics Technologies',
};

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
