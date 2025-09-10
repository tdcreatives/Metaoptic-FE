'use client';

import React, { useEffect, useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import items from '@/constants/announcements.json';
import IconButton from '@/components/IconButton';
import arrowIcon from '@/assets/images/arrow.png';
import Image from 'next/image';

const Announcements = () => {
    const router = useRouter();
    const handleOnNavigate = (slug) => {
        router.push(`/annountcement/${slug}`);
    };

    return (
        <div className='w-full bg-[#D34C39] rounded-t-lg px-6 py-8'>
            {/* Header Section */}
            <div className='mb-8'>
                <div className='flex justify-between items-center mb-4'>
                    <h1 className='text-[48px] font-medium uppercase futura-condensed-medium text-white leading-[1.5]'>
                        Listing ANNOUNCEMENTS
                    </h1>
                </div>
                <div className='w-full h-[2px] bg-white opacity-50'></div>
            </div>

            {/* Announcements List */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-12 !mt-[80px] flex flex-col justify-center'>
                {items.map((item, index) => (
                    <div
                        key={item.id}
                        className='xl:mt-[10px] pb-10'
                    >
                        {/* Date */}
                        <div className='flex items-center gap-2 px-10 py-2'>
                            <div className='text-[20px] font-medium futura-condensed-medium text-white leading-[1.2] text-center'>
                                {item.date}
                            </div>
                        </div>

                        {/* Title Container */}
                        <IconButton
                            label={item.title_btn}
                            icon={<Image src={arrowIcon} alt='arrow' width={32} height={32} />}
                            classNameBtn='uppercase !text-black hover:!text-white'
                            bgDefault='#fff'
                            className='!mt-[10px] !xl:justify-start !justify-start'                        
                            onClick={() => handleOnNavigate(item.slug)}
                        />
                        
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Announcements;
