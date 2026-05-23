import React from 'react';
import InvestorRelationsBanner from '@/layouts/investor-relations/banner';
import InvestorRelationsTabBar from '@/layouts/investor-relations/tab-bar';

export const metadata = {
    title: 'Stock Info | Investor Relations | Metaoptics Technologies',
};

const InvestorRelationsStockInfo = () => {
    return (
        <>
            <InvestorRelationsBanner bannerTitle='STOCK INFO' />
            <InvestorRelationsTabBar />
            <section className='w-full max-w-[1920px] mx-auto px-4 md:px-8 lg:px-16 xl:px-[40px] py-12 md:py-16 lg:py-20 min-h-[300px]' />
        </>
    );
};

export default InvestorRelationsStockInfo;
