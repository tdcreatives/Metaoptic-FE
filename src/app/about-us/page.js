import React from 'react';
import metadataJson from '@/constants/metadata.json';

import AboutUsClientSide from './AboutUsClientSide';

export const metadata = {
    title: metadataJson.aboutUs.title,
    description: metadataJson.aboutUs.description,
    keywords: metadataJson.aboutUs.keywords,
    openGraph: {
        images: [metadataJson.aboutUs.ogImage],
        url: metadataJson.aboutUs.ogUrl,
        type: metadataJson.aboutUs.ogType,
        siteName: metadataJson.aboutUs.ogSiteName,
        locale: metadataJson.aboutUs.ogLocale,
    },
    twitter: {
        card: metadataJson.aboutUs.twitterCard,
        creator: metadataJson.aboutUs.twitterCreator,
        site: metadataJson.aboutUs.twitterSite,
        title: metadataJson.aboutUs.twitterTitle,
        description: metadataJson.aboutUs.twitterDescription,
    },
};

const AboutUs = () => {
    return <AboutUsClientSide />;
};

export default AboutUs;
