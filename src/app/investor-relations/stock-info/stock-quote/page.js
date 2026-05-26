import React from 'react';
import InvestorRelationsBanner from '@/layouts/investor-relations/banner';
import InvestorRelationsTabBar from '@/layouts/investor-relations/tab-bar';
import StockQuoteDetail from '@/layouts/investor-relations/stock-info/stock-quote-detail';
import StockChart from '@/layouts/investor-relations/stock-info/stock-chart';
import DetailedInformation from '@/layouts/investor-relations/stock-info/detailed-information';

export const metadata = {
    title: 'Stock Quote | Investor Relations | Metaoptics Technologies',
};

const StockQuotePage = () => {
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
