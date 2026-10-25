import React from 'react';
import InvestorRelationsBanner from '@/layouts/investor-relations/banner';
import InvestorRelationsTabBar from '@/layouts/investor-relations/tab-bar';
import ContactUs from '@/layouts/investor-relations/resources/contact-us';

export const metadata = {
    title: 'Contact Us | Investor Relations | Metaoptics Technologies',
};

const ContactUsPage = () => {
    return (
        <>
            <InvestorRelationsBanner bannerTitle='RESOURCES' />
            <InvestorRelationsTabBar />
            <ContactUs />
        </>
    );
};

export default ContactUsPage;
