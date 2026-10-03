import React from 'react';
import InvestorRelationsBanner from '@/layouts/investor-relations/banner';
import InvestorRelationsTabBar from '@/layouts/investor-relations/tab-bar';
import InvestorFAQs from '@/layouts/investor-relations/resources/investor-faqs';

export const metadata = {
    title: 'Investor FAQs | Investor Relations | Metaoptics Technologies',
};

const InvestorFAQsPage = () => {
    return (
        <>
            <InvestorRelationsBanner bannerTitle='RESOURCES' />
            <InvestorRelationsTabBar />
            <InvestorFAQs />
        </>
    );
};

export default InvestorFAQsPage;
