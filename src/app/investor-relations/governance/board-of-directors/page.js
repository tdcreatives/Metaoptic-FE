import React from 'react';
import InvestorRelationsBanner from '@/layouts/investor-relations/banner';
import InvestorRelationsTabBar from '@/layouts/investor-relations/tab-bar';
import BoardOfDirectors from '@/layouts/investor-relations/governance/board-of-directors';

export const metadata = {
    title: 'Board Of Directors | Investor Relations | Metaoptics Technologies',
};

const BoardOfDirectorsPage = () => {
    return (
        <>
            <InvestorRelationsBanner bannerTitle='GOVERNANCE' />
            <InvestorRelationsTabBar />
            <BoardOfDirectors />
        </>
    );
};

export default BoardOfDirectorsPage;
