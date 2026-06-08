import React from 'react';

import metadataJson from '@/constants/metadata.json';

import InvestorRelationsBanner from '@/layouts/investor-relations/banner';
import InvestorRelationsTabBar from '@/layouts/investor-relations/tab-bar';
import CorporateOverview from '@/layouts/investor-relations/overview/corporate-overview';
import RecentPressReleases from '@/layouts/investor-relations/overview/recent-press-releases';
import MostRecentEvents from '@/layouts/investor-relations/overview/most-recent-events';
import InvestorPresentation from '@/layouts/investor-relations/overview/investor-presentation';
import { IR_LAUNCH_FLAGS } from '@/constants/ir-feature-flags';
import LatestFinancialResults from '@/layouts/investor-relations/overview/latest-financial-results';
import StockInfo from '@/layouts/investor-relations/overview/stock-info';
import EmailAlerts from '@/layouts/investor-relations/overview/email-alerts';
import IRContacts from '@/layouts/investor-relations/overview/ir-contacts';


export const metadata = {
    title: metadataJson.investorrelations.title,
    description: metadataJson.investorrelations.description,
    keywords: metadataJson.investorrelations.keywords,
    openGraph: {
        images: [metadataJson.investorrelations.ogImage],
        url: metadataJson.investorrelations.ogUrl,
        type: metadataJson.investorrelations.ogType,
        siteName: metadataJson.investorrelations.ogSiteName,
        locale: metadataJson.investorrelations.ogLocale,
    },
    twitter: {
        card: metadataJson.investorrelations.twitterCard,
        creator: metadataJson.investorrelations.twitterCreator,
        site: metadataJson.investorrelations.twitterSite,
        title: metadataJson.investorrelations.twitterTitle,
        description: metadataJson.investorrelations.twitterDescription,
    },
};

const InvestorRelations = () => {
    return (
        <>
            <InvestorRelationsBanner bannerTitle='INVESTOR<br/>RELATIONS' />
            <InvestorRelationsTabBar />
            <CorporateOverview />
            <RecentPressReleases />
            {IR_LAUNCH_FLAGS.showMostRecentEvents && <MostRecentEvents />}
            <InvestorPresentation />
            {IR_LAUNCH_FLAGS.showLatestFinancialResults && (
                <LatestFinancialResults />
            )}
            {IR_LAUNCH_FLAGS.showStockInfo && <StockInfo />}
            <EmailAlerts />
            <IRContacts />
        </>
    );
};

export default InvestorRelations;
