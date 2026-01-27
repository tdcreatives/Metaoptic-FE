import React from 'react';
import metadataJson from '@/constants/metadata.json';

import PrivacyPolicyClientSide from './PrivacyPolicyClientSide';

export const metadata = {
    title: metadataJson.privacyPolicy.title,
    description: metadataJson.privacyPolicy.description,
    keywords: metadataJson.privacyPolicy.keywords,
    openGraph: {
        images: [metadataJson.privacyPolicy.ogImage],
        url: metadataJson.privacyPolicy.ogUrl,
        type: metadataJson.privacyPolicy.ogType,
        siteName: metadataJson.privacyPolicy.ogSiteName,
        locale: metadataJson.privacyPolicy.ogLocale,
    },
    twitter: {
        card: metadataJson.privacyPolicy.twitterCard,
        creator: metadataJson.privacyPolicy.twitterCreator,
        site: metadataJson.privacyPolicy.twitterSite,
        title: metadataJson.privacyPolicy.twitterTitle,
        description: metadataJson.privacyPolicy.twitterDescription,
    },
};

const PrivacyPolicy = () => {
    return <PrivacyPolicyClientSide />;
};

export default PrivacyPolicy;
