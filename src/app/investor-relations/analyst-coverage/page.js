import React from 'react';

import AnalystCoverageAnnouncements from '@/layouts/analyst-coverage/announcements';
import InvestorRelationsBanner from '@/layouts/investor-relations/banner';
import InvestorRelationsTabBar from '@/layouts/investor-relations/tab-bar';

export const metadata = {
    title: 'Analyst Coverage | Investor Relations | Metaoptics Technologies',
};

const AnalystCoveragePage = () => (
    <>
        <InvestorRelationsBanner bannerTitle='ANALYST COVERAGE' />
        <InvestorRelationsTabBar />
        <AnalystCoverageAnnouncements />
    </>
);

export default AnalystCoveragePage;
