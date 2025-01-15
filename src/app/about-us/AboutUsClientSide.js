'use client';

import React from 'react';

import Header from '@/layouts/main/header';
import Footer from '@/layouts/main/footer';

import AboutUsBanner from '@/layouts/about-us/banner';
import Milestone from '@/layouts/about-us/milestone';
import FindMore from '@/layouts/about-us/find-more';

const AboutUsClientSide = () => {
    return (
        <>
            <Header />
            <AboutUsBanner />
            <Milestone />
            <FindMore />
            <Footer />
        </>
    );
};

export default AboutUsClientSide;
