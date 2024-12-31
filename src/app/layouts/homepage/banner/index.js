'use client';

import React from 'react';
import Image from 'next/image';

const Banner = () => {
    return (
        <div className='relative w-full h-[calc(100vh-100px)] overflow-hidden'>
            {/* Video Element */}
            <video
                className='absolute inset-0 w-full h-[70%] xl:object-cover object-contain'
                src='/animation.mp4'
                autoPlay
                muted
                loop
                playsInline
            />

            {/* "View More" Button */}
            <div className='absolute bottom-[72px] left-1/2 transform -translate-x-1/2 flex flex-col justify-center items-center'>
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
                    }}>
                    View more
                </div>
            </div>
        </div>
    );
};

export default Banner;
