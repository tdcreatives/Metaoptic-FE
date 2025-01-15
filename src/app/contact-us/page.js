import React from 'react';

import metadataJson from '@/constants/metadata.json';

import ContactUsClientSide from './ContactUsClientSide';

export const metadata = {
    title: metadataJson.contactUs.title,
    description: metadataJson.contactUs.description,
    keywords: metadataJson.contactUs.keywords,
    ogImage: metadataJson.contactUs.ogImage,
    ogUrl: metadataJson.contactUs.ogUrl,
    ogType: metadataJson.contactUs.ogType,
    ogSiteName: metadataJson.contactUs.ogSiteName,
    ogLocale: metadataJson.contactUs.ogLocale,
    twitterCard: metadataJson.contactUs.twitterCard,
    twitterCreator: metadataJson.contactUs.twitterCreator,
    twitterSite: metadataJson.contactUs.twitterSite,
    twitterTitle: metadataJson.contactUs.twitterTitle,
    twitterDescription: metadataJson.contactUs.twitterDescription,
};

const ContactUs = () => {
    return <ContactUsClientSide />;
};

export default ContactUs;
