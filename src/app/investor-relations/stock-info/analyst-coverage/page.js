import React from 'react';
import InvestorRelationsBanner from '@/layouts/investor-relations/banner';
import InvestorRelationsTabBar from '@/layouts/investor-relations/tab-bar';

export const metadata = {
    title: 'Analyst Coverage | Investor Relations | Metaoptics Technologies',
};

const AnalystCoveragePage = () => {
    return (
        <>
            <InvestorRelationsBanner bannerTitle='STOCK INFO' />
            <InvestorRelationsTabBar />
            <section className='w-full px-[24px] xl:px-[84px] py-12 md:py-16 lg:py-20 min-h-[300px]' />
        </>
    );
};

export default AnalystCoveragePage;
