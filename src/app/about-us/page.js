import React from 'react';
import { buildPageMetadataFromSection } from '@/lib/seo';

import AboutUsClientSide from './AboutUsClientSide';

export const metadata = buildPageMetadataFromSection('aboutUs');

const AboutUs = () => {
    return <AboutUsClientSide />;
};

export default AboutUs;
