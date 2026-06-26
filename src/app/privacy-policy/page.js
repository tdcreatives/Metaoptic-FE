import React from 'react';
import { buildPageMetadataFromSection } from '@/lib/seo';

import PrivacyPolicyClientSide from './PrivacyPolicyClientSide';

export const metadata = buildPageMetadataFromSection('privacyPolicy');

const PrivacyPolicy = () => {
    return <PrivacyPolicyClientSide />;
};

export default PrivacyPolicy;
