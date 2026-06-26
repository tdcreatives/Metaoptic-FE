import React from 'react';
import { buildIrPageMetadata } from '@/lib/seo';
import InvestorRelationsBanner from '@/layouts/investor-relations/banner';
import InvestorRelationsTabBar from '@/layouts/investor-relations/tab-bar';
import BoardOfDirectors from '@/layouts/investor-relations/governance/board-of-directors';

export const metadata = buildIrPageMetadata('boardOfDirectors');

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
