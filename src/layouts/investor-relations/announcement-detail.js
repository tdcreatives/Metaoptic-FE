'use client';

import React, { useEffect, useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import items from '@/constants/announcements.json';
import BaseButton from '@/components/BaseButton';

const AnnouncementDetail = () => {
    const router = useRouter();
    
    const handleOnNavigate = (slug) => {
        router.push(`/annountcement/${slug}`);
    };

    return (
        <div className='w-full bg-[#d34c39] xl:py-6 py-3 xl:px-6 px-3 rounded-lg text-white'>
            {/* Specifications Title Row with Icon */}
            <div className='flex justify-between items-center mb-0'>
                <div className='xl:text-[48px] text-[32px] uppercase relative z-30 futura-condensed-medium xl:mt-0 mt-3 text-start'>
                    Listing ANNOUNCEMENTS
                </div>                
            </div>

            <div className='w-full h-[2px] bg-white mx-auto mb-8'></div>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-12 !mt-[80px]'>
                {items.map((item, index) => (
                    <div
                        key={item.id}
                        className='xl:mt-[10px] pb-10'>
                        <div className='text-left text-[24px] font-bold text-white'>{item.date}</div>
                        <BaseButton
                        label={item.title}
                        classNameBtn='uppercase !text-black hover:!text-white'
                        bgDefault='#fff'
                        className='!mt-[10px]'                        
                        onClick={() => handleOnNavigate(item.slug)}
                    />
                    </div>
                ))}
            </div>

            
        </div>
    );
};

export default AnnouncementDetail;
