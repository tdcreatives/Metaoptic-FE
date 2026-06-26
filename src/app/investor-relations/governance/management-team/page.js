import React from 'react';
import { buildIrPageMetadata } from '@/lib/seo';
import InvestorRelationsBanner from '@/layouts/investor-relations/banner';
import InvestorRelationsTabBar from '@/layouts/investor-relations/tab-bar';
import ManagementTeam from '@/layouts/investor-relations/governance/management-team';

export const metadata = buildIrPageMetadata('managementTeam');

const ManagementTeamPage = () => {
    return (
        <>
            <InvestorRelationsBanner bannerTitle='GOVERNANCE' />
            <InvestorRelationsTabBar />
            <ManagementTeam />
        </>
    );
};

export default ManagementTeamPage;
