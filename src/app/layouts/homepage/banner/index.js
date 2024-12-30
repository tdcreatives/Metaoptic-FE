'use client';

import React from 'react';
import Image from 'next/image';

const Banner = () => {
    return (
        <div className='relative w-full h-[calc(100vh-100px)] overflow-hidden'>
            {/* Video Element */}
            <video
                className='absolute inset-0 w-full h-[70%] object-cover'
                src='/animation.mp4'
                autoPlay
                muted
                loop
                playsInline
            />

            {/* "View More" Button */}
            <div className='absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col justify-center items-center'>
                <Image
                    src='/view-more.svg'
                    alt='View more'
                    width='0'
                    height='0'
                    className='w-[90px] h-auto cursor-pointer'
                />

                <div
                    className='uppercase text-[20px] mt-[-16px] text-[#d34c39] ml-2'
                    style={{
                        letterSpacing: '6px',
                    }}>
                    View more
                </div>
            </div>
        </div>
    );
};

export default Banner;
