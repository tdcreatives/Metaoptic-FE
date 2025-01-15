import React from 'react';
import metadataJson from '@/constants/metadata.json';

import AboutUsClientSide from './AboutUsClientSide';

export const metadata = {
    title: metadataJson.aboutUs.title,
    description: metadataJson.aboutUs.description,
};

const AboutUs = () => {
    return <AboutUsClientSide />;
};

export default AboutUs;
