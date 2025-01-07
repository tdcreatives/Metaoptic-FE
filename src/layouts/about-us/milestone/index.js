'use client';

import React from 'react';
import { Timeline } from '@/components/ui/timeline';

import { isDesktop } from 'react-device-detect';

const MileStone = () => {
    const data = [
        {
            title: '2022',
            content: (
                <div>
                    <div className='text-white tracking-[0.5rem] futura-condensed-medium xl:text-[48px] text-[28px]'>
                        EARLY DEVELOPMENT
                    </div>

                    <div className='text-[#A7A9AC] xl:text-[24px] mt-6 text-[18px]'>
                        Incepted in June 2021 <br /> Launched Direct Laser Writer in 2022
                    </div>
                </div>
            ),
        },
        {
            title: '2023',
            content: (
                <div>
                    <div className='text-white tracking-[0.5rem] futura-condensed-medium xl:text-[48px] text-[28px]'>
                        EARLY DEVELOPMENT
                    </div>

                    <div className='text-[#A7A9AC] xl:text-[24px] mt-6 text-[18px]'>
                        Developed color lens and delivered its {isDesktop ? <br /> : ' '}
                        1st 12 inches glass wafer of color camera{' '}
                        {isDesktop ? <br /> : ' '}
                        with DUV immersion lithographic systems.
                    </div>
                </div>
            ),
        },
        {
            title: '2024',
            content: (
                <div>
                    <div className='text-white tracking-[0.5rem] futura-condensed-medium xl:text-[48px] text-[28px]'>
                        EARLY DEVELOPMENT
                    </div>

                    <div className='text-[#A7A9AC] xl:text-[24px] mt-6 text-[18px]'>
                        Fulfill pipeline projects, to produce and{' '}
                        {isDesktop ? <br /> : ' '}
                        deliver IoT devices with meta lens color{' '}
                        {isDesktop ? <br /> : ' '}
                        computational cameras into the market in 2024.
                    </div>

                    <div className='text-[#A7A9AC] xl:text-[24px] mt-6 text-[18px]'>
                        Ramp up production capacity with both {isDesktop ? <br /> : ' '}
                        DLW machine farm and the DUV {isDesktop ? <br /> : ' '}
                        immersion lithographic line.
                    </div>
                </div>
            ),
        },
    ];
    return (
        <div className='relative w-full bg-milestone bg-center bg-no-repeat bg-cover'>
            <div className='grid xl:grid-cols-2 grid-cols-1 gap-4 items-center w-[90%] mx-auto ml:py-0 py-10'>
                <div className='flex flex-col'>
                    <div className='uppercase xl:text-[40px] text-[24px] tracking-[0.4rem] font-normal text-[#d34c39]'>
                        MILESTONES OF
                    </div>

                    <div className='uppercase xl:text-[80px] text-[48px] tracking-[1rem] futura-condensed-medium text-white'>
                        METAOPTICS
                    </div>
                </div>

                <div className='w-full'>
                    <Timeline data={data} />
                </div>
            </div>
        </div>
    );
};

export default MileStone;
