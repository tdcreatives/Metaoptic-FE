'use client';

import React from 'react';
import Image from 'next/image';

const AboutUs = () => {
    return (
        <section
            className='relative flex xl:flex-row flex-col xl:h-[140vh] h-auto snap-start xl:pt-16 pt-8'
            id='about-us'>
            {/* Left Content */}
            <div className='flex flex-col'>
                <h2 className='xl:text-[150px] text-[64px] text-[#d34c39] uppercase futura-condensed-medium xl:ml-16 ml-0 xl:text-start text-center'>
                    About Us
                </h2>

                {/* Content with Background */}
                <div className='bg-[#ebebeb] xl:p-16 p-8 rounded-lg'>
                    <p className='text-[20px] mb-6 xl:max-w-[39%] max-w-full'>
                        At Metaoptics Technologies, we are breaking through current lens
                        limitations in consumer and IoT applications.
                    </p>

                    <p className='text-[20px] leading-relaxed mb-6 xl:max-w-[39%] max-w-full'>
                        Our high-throughput meta lens production ensures efficiency and
                        cost-effectiveness. <br />
                        As AR/VR and HUD technologies rapidly expands, our innovative meta
                        lens are essential to provideminiaturization in supporting this
                        market growth.
                    </p>

                    <div className='flex xl:justify-start justify-center xl:mt-10 mt-6 xl:ml-10 ml-0'>
                        <button className='bg-[#d34c39] text-white font-bold px-10 py-3 rounded-full futura-medium xl:tracking-[4px] tracking-[2px] xl:text-[20px] text-[16px]'>
                            FIND OUT MORE
                        </button>
                    </div>
                </div>
            </div>

            {/* Right Section with Overlapping Images */}
            <div className='xl:absolute relative right-0 xl:w-[58%] w-[95%] mx-auto h-full xl:mt-0 mt-10'>
                <div className='grid grid-cols-2 xl:gap-5 gap-3'>
                    <div className='flex flex-col xl:gap-5 gap-3'>
                        <Image
                            src='/about-1.png'
                            alt='About 1'
                            width={0}
                            height='500'
                            sizes='100vw'
                            objectFit='cover'
                            className='rounded-lg shadow-lg w-full h-full rounded-[30px] min-h-[450px]'
                        />

                        <Image
                            src='/about-3.png'
                            alt='About 3'
                            width={0}
                            height={0}
                            sizes='100vw'
                            objectFit='cover'
                            className='rounded-lg shadow-lg w-full h-full rounded-[30px] min-h-[450px]'
                        />
                    </div>

                    <div className='flex flex-col xl:gap-5 gap-3 mb-[-48px] mt-[52px] '>
                        <Image
                            src='/about-2.png'
                            alt='About 2'
                            width={0}
                            height={0}
                            sizes='100vw'
                            objectFit='cover'
                            className='rounded-lg shadow-lg w-full h-full rounded-[30px] min-h-[450px]'
                        />
                        <Image
                            src='/about-4.png'
                            alt='About 4'
                            width={0}
                            height={0}
                            sizes='100vw'
                            objectFit='cover'
                            className='rounded-lg shadow-lg w-full h-full rounded-[30px] min-h-[450px]'
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutUs;
