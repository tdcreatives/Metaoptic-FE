import React from 'react';
import { IR_LAUNCH_FLAGS } from '@/constants/ir-feature-flags';
import IrLaunchRedirect from '@/layouts/investor-relations/ir-launch-redirect';
import { buildIrPageMetadata } from '@/lib/seo';
import InvestorRelationsBanner from '@/layouts/investor-relations/banner';
import InvestorRelationsTabBar from '@/layouts/investor-relations/tab-bar';
import QuarterlyResults from '@/layouts/investor-relations/financials/quarterly-results';

export const metadata = buildIrPageMetadata('quarterlyResults');

const QuarterlyResultsPage = () => {
    if (!IR_LAUNCH_FLAGS.showQuarterlyResults) {
        return <IrLaunchRedirect to='/investor-relations/financials/sec-filings' />;
    }

    return (
        <>
            <InvestorRelationsBanner bannerTitle='FINANCIALS' />
            <InvestorRelationsTabBar />
            <QuarterlyResults />
        </>
    );
};

export default QuarterlyResultsPage;
