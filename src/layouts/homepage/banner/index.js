'use client';

import React from 'react';
import Image from 'next/image';

import { isMobile } from 'react-device-detect';

const Banner = () => {
    return (
        <div className='relative w-full xl:h-[calc(100vh-100px)] h-[60vh] overflow-hidden'>
            {/* Video Element */}
            <video
                className='absolute inset-0 w-full xl:h-[70%] h-[40vh] xl:object-cover object-contain'
                src={isMobile ? '/mobile-animation.mp4' : '/animation.mp4'}
                autoPlay
                muted
                loop
                playsInline
            />

            {/* "View More" Button */}
            <div
                className='absolute bottom-[72px] left-1/2 transform -translate-x-1/2 flex flex-col justify-center items-center'
                onClick={() =>
                    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })
                }>
                <Image
                    src='/view-more.svg'
                    alt='View more'
                    width='0'
                    height='0'
                    className='xl:w-[40px] w-[32px] h-auto cursor-pointer'
                />

                <div
                    className='uppercase xl:text-[20px] text-[16px] text-[#000] ml-2'
                    style={{
                        letterSpacing: '4px',
                        cursor: 'pointer',
                    }}>
                    View more
                </div>
            </div>
        </div>
    );
};

export default Banner;
