'use client';

import React from 'react';

import Image from 'next/image';

const AboutUsBanner = () => {
    return (
        <div className='mx-auto px-[5.2vw] xl:py-[72px]'>
            <div className='text-[#d34c39] uppercase xl:text-[48px] text-[32px] futura-medium'>
                ABOUT METAOPTICS
            </div>

            <div className='xl:text-[105px] text-[60px] futura-condensed-medium leading-tight mt-6 text-[#231f20]'>
                REDEFINING WHAT’S POSSIBLE IN OPTICAL APPLICATIONS
            </div>

            <div className='xl:w-[80vw] w-[90vw] xl:mt-[108px] mt-[84px] mx-auto  max-w-[1660px]'>
                <Image
                    src='/about-us/banner.png'
                    alt='Banner'
                    width='0'
                    height='0'
                    blurDataURL='/about-us/banner.png'
                    className='w-full'
                />

                <div className='xl:w-[50%] w-full ml-auto flex flex-col gap-5 xl:text-[24px] text-[16px] my-10'>
                    <div>
                        We strive to become a global leader in metalens innovation,
                        combining advanced design expertise with scalable mass production
                        capabilities to redefine the future of optical technology by 2024.
                    </div>

                    <div>
                        Our focus is on developing a robust supply chain and
                        state-of-the-art manufacturing equipment, ensuring seamless
                        integration and unparalleled efficiency in metalens production for
                        diverse applications.
                    </div>

                    <div>
                        Through continuous innovation, precision engineering, and a
                        commitment to excellence, we aim to establish ourselves as a
                        Metalens Excellence Center, driving advancements that shape
                        industries worldwide.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutUsBanner;
