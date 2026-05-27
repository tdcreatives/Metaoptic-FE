import React from 'react';
import InvestorRelationsBanner from '@/layouts/investor-relations/banner';
import InvestorRelationsTabBar from '@/layouts/investor-relations/tab-bar';
import EmailAlerts from '@/layouts/investor-relations/resources/email-alerts';

export const metadata = {
    title: 'Email Alerts | Investor Relations | Metaoptics Technologies',
};

const EmailAlertsPage = () => {
    return (
        <>
            <InvestorRelationsBanner bannerTitle='RESOURCES' />
            <InvestorRelationsTabBar />
            <EmailAlerts />
        </>
    );
};

export default EmailAlertsPage;
