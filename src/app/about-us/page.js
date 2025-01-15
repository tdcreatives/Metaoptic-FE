import React from 'react';
import metadataJson from '@/constants/metadata.json';

import AboutUsClientSide from './AboutUsClientSide';

export const metadata = {
    title: metadataJson.aboutUs.title,
    description: metadataJson.aboutUs.description,
    keywords: metadataJson.aboutUs.keywords,
    ogImage: metadataJson.aboutUs.ogImage,
    ogUrl: metadataJson.aboutUs.ogUrl,
    ogType: metadataJson.aboutUs.ogType,
    ogSiteName: metadataJson.aboutUs.ogSiteName,
    ogLocale: metadataJson.aboutUs.ogLocale,
    twitterCard: metadataJson.aboutUs.twitterCard,
    twitterCreator: metadataJson.aboutUs.twitterCreator,
    twitterSite: metadataJson.aboutUs.twitterSite,
    twitterTitle: metadataJson.aboutUs.twitterTitle,
    twitterDescription: metadataJson.aboutUs.twitterDescription,
};

const AboutUs = () => {
    return <AboutUsClientSide />;
};

export default AboutUs;
