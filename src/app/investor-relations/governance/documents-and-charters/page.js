import React from 'react';
import InvestorRelationsBanner from '@/layouts/investor-relations/banner';
import InvestorRelationsTabBar from '@/layouts/investor-relations/tab-bar';
import DocumentsAndCharters from '@/layouts/investor-relations/governance/documents-and-charters';

export const metadata = {
    title: 'Documents & Charters | Investor Relations | Metaoptics Technologies',
};

const DocumentsAndChartersPage = () => {
    return (
        <>
            <InvestorRelationsBanner bannerTitle='GOVERNANCE' />
            <InvestorRelationsTabBar />
            <DocumentsAndCharters />
        </>
    );
};

export default DocumentsAndChartersPage;
