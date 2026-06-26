import React from 'react';
import { buildIrPageMetadata } from '@/lib/seo';
import { IR_LAUNCH_FLAGS, IR_STOCK_INFO_FALLBACK } from '@/constants/ir-feature-flags';
import IrLaunchRedirect from '@/layouts/investor-relations/ir-launch-redirect';
import InvestorRelationsBanner from '@/layouts/investor-relations/banner';
import InvestorRelationsTabBar from '@/layouts/investor-relations/tab-bar';
import StockQuoteDetail from '@/layouts/investor-relations/stock-info/stock-quote-detail';
import StockChart from '@/layouts/investor-relations/stock-info/stock-chart';
import DetailedInformation from '@/layouts/investor-relations/stock-info/detailed-information';

export const metadata = buildIrPageMetadata('stockQuote');

const StockQuotePage = () => {
    if (!IR_LAUNCH_FLAGS.showStockInfo) {
        return <IrLaunchRedirect to={IR_STOCK_INFO_FALLBACK} />;
    }

    return (
        <>
            <InvestorRelationsBanner bannerTitle='STOCK INFO' />
            <InvestorRelationsTabBar />
            <StockQuoteDetail />
            <StockChart />
            <DetailedInformation />
        </>
    );
};

export default StockQuotePage;
