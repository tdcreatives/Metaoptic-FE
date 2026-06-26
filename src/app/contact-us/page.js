import React from 'react';
import { buildPageMetadataFromSection } from '@/lib/seo';

import ContactUsClientSide from './ContactUsClientSide';

export const metadata = buildPageMetadataFromSection('contactUs');

const ContactUs = () => {
    return <ContactUsClientSide />;
};

export default ContactUs;
