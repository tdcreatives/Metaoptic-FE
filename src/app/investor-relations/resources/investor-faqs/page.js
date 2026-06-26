import React from 'react';
import { buildIrPageMetadata } from '@/lib/seo';
import InvestorRelationsBanner from '@/layouts/investor-relations/banner';
import InvestorRelationsTabBar from '@/layouts/investor-relations/tab-bar';
import InvestorFAQs from '@/layouts/investor-relations/resources/investor-faqs';

export const metadata = buildIrPageMetadata('investorFaqs');

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
