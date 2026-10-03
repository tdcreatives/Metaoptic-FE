import React from 'react';
import InvestorRelationsBanner from '@/layouts/investor-relations/banner';
import InvestorRelationsTabBar from '@/layouts/investor-relations/tab-bar';
import CommitteeComposition from '@/layouts/investor-relations/governance/committee-composition';

export const metadata = {
    title: 'Committee Composition | Investor Relations | Metaoptics Technologies',
};

const CommitteeCompositionPage = () => {
    return (
        <>
            <InvestorRelationsBanner bannerTitle='GOVERNANCE' />
            <InvestorRelationsTabBar />
            <CommitteeComposition />
        </>
    );
};

export default CommitteeCompositionPage;
