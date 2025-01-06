import Image from 'next/image';
import React from 'react';
import { Timeline } from '@/components/ui/timeline';

const MileStone = () => {
    const data = [
        {
            title: '2022',
            content: (
                <div>
                    <div className='text-white tracking-[0.5rem] futura-condensed-medium text-[48px]'>
                        EARLY DEVELOPMENT
                    </div>

                    <div className='text-[#A7A9AC] text-[24px] mt-6'>
                        Incepted in June 2021 <br /> Launched Direct Laser Writer in 2022
                    </div>
                </div>
            ),
        },
        {
            title: '2023',
            content: (
                <div>
                    <div className='text-white tracking-[0.5rem] futura-condensed-medium text-[48px]'>
                        EARLY DEVELOPMENT
                    </div>

                    <div className='text-[#A7A9AC] text-[24px] mt-6'>
                        Developed color lens and delivered its <br />
                        1st 12 inches glass wafer of color camera <br />
                        with DUV immersion lithographic systems.
                    </div>
                </div>
            ),
        },
        {
            title: '2024',
            content: (
                <div>
                    <div className='text-white tracking-[0.5rem] futura-condensed-medium text-[48px]'>
                        EARLY DEVELOPMENT
                    </div>

                    <div className='text-[#A7A9AC] text-[24px] mt-6'>
                        Fulfill pipeline projects, to produce and <br />
                        deliver IoT devices with meta lens color <br />
                        computational cameras into the market in 2024.
                    </div>

                    <div className='text-[#A7A9AC] text-[24px] mt-6'>
                        Ramp up production capacity with both <br />
                        DLW machine farm and the DUV <br />
                        immersion lithographic line.
                    </div>
                </div>
            ),
        },
    ];
    return (
        <div className='relative w-full bg-milestone bg-center bg-no-repeat'>
            <div className=' grid grid-cols-2 gap-4 items-center w-[90%] mx-auto'>
                <div className='flex flex-col'>
                    <div className='uppercase text-[40px] tracking-[0.4rem] font-normal text-[#d34c39]'>
                        MILESTONES OF
                    </div>

                    <div className='uppercase xl:text-[80px] text-[60px] tracking-[1rem] futura-condensed-medium text-white'>
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
