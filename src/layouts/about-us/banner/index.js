'use client';

import React from 'react';

import Image from 'next/image';

const AboutUsBanner = () => {
    return (
        <div className='mx-auto px-[5.2vw] xl:py-[72px]'>
            <div className='text-[#d34c39] uppercase text-[48px] futura-medium'>
                ABOUT METAOPTICS
            </div>

            <div className='text-[105px] futura-condensed-medium leading-tight mt-6 text-[#231f20]'>
                REDEFINING WHAT’S POSSIBLE IN OPTICAL APPLICATIONS
            </div>

            <div className='w-[80vw] mt-[108px] mx-auto  max-w-[1660px]'>
                <Image
                    src='/about-us/banner.png'
                    alt='Banner'
                    width='0'
                    height='0'
                    blurDataURL='/about-us/banner.png'
                    className='w-full'
                />

                <div className='xl:w-[50%] w-full ml-auto flex flex-col gap-5 text-[24px] mt-10'>
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
