import React from 'react';
import { buildIrPageMetadata } from '@/lib/seo';
import InvestorRelationsBanner from '@/layouts/investor-relations/banner';
import InvestorRelationsTabBar from '@/layouts/investor-relations/tab-bar';
import SECFilings from '@/layouts/investor-relations/financials/sec-filings';

export const metadata = buildIrPageMetadata('secFilings');

const SECFilingsPage = () => {
    return (
        <>
            <InvestorRelationsBanner bannerTitle='FINANCIALS' />
            <InvestorRelationsTabBar />
            <SECFilings />
        </>
    );
};

export default SECFilingsPage;
