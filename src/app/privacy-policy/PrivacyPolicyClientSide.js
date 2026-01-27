'use client';

import React from 'react';

import Header from '@/layouts/main/header';
import Footer from '@/layouts/main/footer';

import Content from '@/layouts/privacy-policy/content';

const PrivacyPolicyClientSide = () => {
    return (
        <>
            <Header />
            <Content />
            <Footer />
        </>
    );
};

export default PrivacyPolicyClientSide;
