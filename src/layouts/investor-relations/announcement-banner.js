'use client';

import React, { useEffect, useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import './banner.scss';
import BaseButton from '@/components/BaseButton';

const AnnouncementBanner = ({ bannerTitle = 'INVESTOR<br/>RELATIONS' }) => {
    const [line1, line2] = bannerTitle.split('<br/>');
    const router = useRouter();
    return (
        <div className='relative w-full bg-[#F0F0F0] pb-20 overflow-hidden investor-relations-banner'>
            {/* Background logo images */}
            <div 
                className='absolute top-0 right-0 w-[200px] h-[185px] md:w-[300px] md:h-[277px] lg:w-[400px] lg:h-[367px] xl:w-[450px] xl:h-[415px] bg-cover bg-no-repeat bg-center banner-logo bg-[url(/investor-relations/logo-top-right.png)] bg-top-right'
            />
            <div 
                className='absolute bottom-0 left-0 w-[246px] h-[172px] md:w-[370px] md:h-[259px] lg:w-[493px] lg:h-[251px] xl:w-[554px] xl:h-[388px] bg-cover bg-no-repeat bg-center banner-logo bg-[url(/investor-relations/logo-bottom-left.png)] bg-bottom-left'
            />
            
            {/* Main container with proper padding and dimensions */}
            <div className='relative flex px-4 md:px-8 lg:px-16 xl:px-[40px] py-8 md:py-12 lg:py-16 xl:py-[52px] w-full max-w-[1920px] mx-auto min-h-[400px] md:min-h-[500px] lg:min-h-[567px]'>

                {/* Main text content */}
                <div className='relative flex flex-col justify-center px-[40px] md:px-[60px] lg:px-[80px] xl:px-[40px]'>
                    <BaseButton
                            label={'Listing announcements'}
                            classNameBtn='uppercase'
                            bgDefault='#d34c39'
                            className='!mt-[10px] !xl:justify-start !justify-start'                        
                            onClick={() => router.push('/investor-relations')}
                        />
                    <div 
                        className='text-black futura-condensed-medium font-medium text-[48px] md:text-[60px] lg:text-[100px] xl:text-[120px] leading-[1.1] tracking-[2%] md:tracking-[4%] lg:tracking-[6%] xl:tracking-[8%] uppercase tracking-[1rem] mb-4 md:mb-6 lg:mb-8 banner-text line1-width text-center sm:text-left'
                        dangerouslySetInnerHTML={{ __html: line1 }}
                    />
                
                    <div 
                        className='text-black futura-condensed-medium font-medium text-[48px] md:text-[60px] lg:text-[100px] xl:text-[120px] leading-[0.95] tracking-[2%] md:tracking-[4%] lg:tracking-[6%] xl:tracking-[8%] uppercase tracking-[1rem] banner-text whitespace-normal break-words text-center sm:text-left sm:pl-[calc(0.8*var(--line1-width))]'
                        style={{ '--line1-width': `${line1.length}ch` }}
                        dangerouslySetInnerHTML={{ __html: line2 }}
                    />
                </div>
            </div>
        </div>
    );
};

export default AnnouncementBanner;
