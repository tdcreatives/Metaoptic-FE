'use client';

import React from 'react';

import Header from '@/layouts/main/header';
import Footer from '@/layouts/main/footer';

import AboutUsBanner from '@/layouts/about-us/banner';

const AboutUs = () => {
    return (
        <>
            <Header />

            <AboutUsBanner />
            <Footer />
        </>
    );
};

export default AboutUs;
