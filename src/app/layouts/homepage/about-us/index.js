'use client';

import React from 'react';
import Image from 'next/image';

const AboutUs = () => {
    return (
        <section className='relative flex h-[140vh] snap-start pt-16' id='about-us'>
            {/* Left Content */}
            <div className='flex flex-col'>
                <h2 className='text-[150px] text-[#d34c39] uppercase futura-condensed-medium ml-16'>
                    About Us
                </h2>

                {/* Content with Background */}
                <div className='bg-gray-200 p-16 rounded-lg'>
                    <p className='text-[20px] mb-6 max-w-[39%]'>
                        At Metaoptics Technologies, we are breaking through current lens
                        limitations in consumer and IoT applications.
                    </p>

                    <p className='text-[20px] leading-relaxed mb-6 max-w-[39%]'>
                        Our high-throughput meta lens production ensures efficiency and
                        cost-effectiveness. <br />
                        As AR/VR and HUD technologies rapidly expands, our innovative meta
                        lens are essential to provideminiaturization in supporting this
                        market growth.
                    </p>
                    <button className='bg-[#d34c39] text-white font-bold text-lg ml-10 px-10 py-3 rounded-full futura-medium tracking-[4px] mt-6 text-[20px]'>
                        FIND OUT MORE
                    </button>
                </div>
            </div>

            {/* Right Section with Overlapping Images */}
            <div className='absolute right-0 top- w-[58%] h-full'>
                <div className='grid grid-cols-2 gap-5'>
                    <div className='flex flex-col gap-5'>
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

                    <div className='flex flex-col gap-5 mb-[-48px] mt-[52px]'>
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
