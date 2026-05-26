import React from 'react';
import InvestorRelationsBanner from '@/layouts/investor-relations/banner';
import InvestorRelationsTabBar from '@/layouts/investor-relations/tab-bar';
import AnalystCoverage from '@/layouts/investor-relations/stock-info/analyst-coverage';

export const metadata = {
    title: 'Analyst Coverage | Investor Relations | Metaoptics Technologies',
};

const AnalystCoveragePage = () => {
    return (
        <>
            <InvestorRelationsBanner bannerTitle='STOCK INFO' />
            <InvestorRelationsTabBar />
            <AnalystCoverage />
        </>
    );
};

export default AnalystCoveragePage;
