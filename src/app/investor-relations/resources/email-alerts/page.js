import React from 'react';
import IrLaunchRedirect from '@/layouts/investor-relations/ir-launch-redirect';
import InvestorRelationsBanner from '@/layouts/investor-relations/banner';
import InvestorRelationsTabBar from '@/layouts/investor-relations/tab-bar';
import EmailAlerts from '@/layouts/investor-relations/resources/email-alerts';
import { IR_LAUNCH_FLAGS } from '@/constants/ir-feature-flags';

export const metadata = {
    title: 'Email Alerts | Investor Relations | Metaoptics Technologies',
};

const EmailAlertsPage = () => {
    if (!IR_LAUNCH_FLAGS.showEmailAlerts) {
        return <IrLaunchRedirect to='/investor-relations/resources/investor-faqs' />;
    }

    return (
        <>
            <InvestorRelationsBanner bannerTitle='RESOURCES' />
            <InvestorRelationsTabBar />
            <EmailAlerts />
        </>
    );
};

export default EmailAlertsPage;
