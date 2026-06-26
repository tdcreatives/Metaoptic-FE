import React from 'react';
import { buildPageMetadataFromSection } from '@/lib/seo';
import { getStandaloneAnalystCoverageRedirect, IR_LAUNCH_FLAGS } from '@/constants/ir-feature-flags';
import IrLaunchRedirect from '@/layouts/investor-relations/ir-launch-redirect';
import Header from '@/layouts/main/header';
import Footer from '@/layouts/main/footer';
import AnalystCoverageAnnouncements from '@/layouts/analyst-coverage/announcements';
import AnalystCoverageBanner from '@/layouts/analyst-coverage/banner';

export const metadata = buildPageMetadataFromSection('analystCoverage');

const AnalystCoveragePage = () => {
    if (!IR_LAUNCH_FLAGS.showAnalystCoverage) {
        return <IrLaunchRedirect to={getStandaloneAnalystCoverageRedirect()} />;
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
