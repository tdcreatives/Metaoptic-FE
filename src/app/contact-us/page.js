import React from 'react';

import metadataJson from '@/constants/metadata.json';

import ContactUsClientSide from './ContactUsClientSide';

export const metadata = {
    title: metadataJson.contactUs.title,
    description: metadataJson.contactUs.description,
    keywords: metadataJson.contactUs.keywords,
    openGraph: {
        images: [metadataJson.contactUs.ogImage],
        url: metadataJson.contactUs.ogUrl,
        type: metadataJson.contactUs.ogType,
        siteName: metadataJson.contactUs.ogSiteName,
        locale: metadataJson.contactUs.ogLocale,
    },
    twitter: {
        card: metadataJson.contactUs.twitterCard,
        creator: metadataJson.contactUs.twitterCreator,
        site: metadataJson.contactUs.twitterSite,
        title: metadataJson.contactUs.twitterTitle,
        description: metadataJson.contactUs.twitterDescription,
    },
};

const ContactUs = () => {
    return <ContactUsClientSide />;
};

export default ContactUs;
