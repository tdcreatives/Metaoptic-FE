import React from 'react';
import InvestorRelationsBanner from '@/layouts/investor-relations/banner';
import InvestorRelationsTabBar from '@/layouts/investor-relations/tab-bar';
import ManagementTeam from '@/layouts/investor-relations/governance/management-team';

export const metadata = {
    title: 'Management Team | Investor Relations | Metaoptics Technologies',
};

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
