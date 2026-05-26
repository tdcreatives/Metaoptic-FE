import React from 'react';
import InvestorRelationsBanner from '@/layouts/investor-relations/banner';
import InvestorRelationsTabBar from '@/layouts/investor-relations/tab-bar';
import QuarterlyResults from '@/layouts/investor-relations/financials/quarterly-results';

export const metadata = {
    title: 'Quarterly Results | Investor Relations | Metaoptics Technologies',
};

const QuarterlyResultsPage = () => {
    return (
        <>
            <InvestorRelationsBanner bannerTitle='FINANCIALS' />
            <InvestorRelationsTabBar />
            <QuarterlyResults />
        </>
    );
};

export default QuarterlyResultsPage;
