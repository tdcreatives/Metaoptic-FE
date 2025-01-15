import React from 'react';

import metadataJson from '@/constants/metadata.json';

import ContactUsClientSide from './ContactUsClientSide';

export const metadata = {
    title: metadataJson.contactUs.title,
    description: metadataJson.contactUs.description,
};

const ContactUs = () => {
    return <ContactUsClientSide />;
};

export default ContactUs;
