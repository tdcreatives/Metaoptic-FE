import React from 'react';
import { IR_LAUNCH_FLAGS } from '@/constants/ir-feature-flags';
import IrLaunchRedirect from '@/layouts/investor-relations/ir-launch-redirect';
import InvestorRelationsBanner from '@/layouts/investor-relations/banner';
import InvestorRelationsTabBar from '@/layouts/investor-relations/tab-bar';
import AnalystCoverage from '@/layouts/investor-relations/stock-info/analyst-coverage';

export const metadata = {
    title: 'Analyst Coverage | Investor Relations | Metaoptics Technologies',
};

const AnalystCoveragePage = () => {
    if (!IR_LAUNCH_FLAGS.showAnalystCoverage) {
        return <IrLaunchRedirect to='/investor-relations/stock-info/stock-quote' />;
    }

    return (
        <>
            <InvestorRelationsBanner bannerTitle='STOCK INFO' />
            <InvestorRelationsTabBar />
            <AnalystCoverage />
        </>
    );
};

export default AnalystCoveragePage;
