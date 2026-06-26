import React from 'react';
import { buildIrPageMetadata } from '@/lib/seo';
import { IR_LAUNCH_FLAGS } from '@/constants/ir-feature-flags';
import IrLaunchRedirect from '@/layouts/investor-relations/ir-launch-redirect';
import InvestorRelationsBanner from '@/layouts/investor-relations/banner';
import InvestorRelationsTabBar from '@/layouts/investor-relations/tab-bar';
import DocumentsAndCharters from '@/layouts/investor-relations/governance/documents-and-charters';

export const metadata = buildIrPageMetadata('documentsAndCharters');

const DocumentsAndChartersPage = () => {
    if (!IR_LAUNCH_FLAGS.showDocumentsAndCharters) {
        return (
            <IrLaunchRedirect to='/investor-relations/governance/board-of-directors' />
        );
    }

    return (
        <>
            <InvestorRelationsBanner bannerTitle='GOVERNANCE' />
            <InvestorRelationsTabBar />
            <DocumentsAndCharters />
        </>
    );
};

export default DocumentsAndChartersPage;
