import React from 'react';
import { IR_LAUNCH_FLAGS } from '@/constants/ir-feature-flags';
import IrLaunchRedirect from '@/layouts/investor-relations/ir-launch-redirect';
import Header from '@/layouts/main/header';
import Footer from '@/layouts/main/footer';
import AnalystCoverageAnnouncements from '@/layouts/analyst-coverage/announcements';
import AnalystCoverageBanner from '@/layouts/analyst-coverage/banner';
import metadataJson from '@/constants/metadata.json';

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

const AnalystCoveragePage = () => {
    if (!IR_LAUNCH_FLAGS.showAnalystCoverage) {
        return <IrLaunchRedirect to='/investor-relations/stock-info/stock-quote' />;
    }

    return (
        <>
            <Header />
            <AnalystCoverageBanner />
            <AnalystCoverageAnnouncements />
            <Footer />
        </>
    );
};

export default AnalystCoveragePage;
