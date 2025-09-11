'use client';

import React, { useEffect, useCallback, useState } from 'react';
import { gsap } from 'gsap';
import './banner.scss';

const InvestorRelationsBanner = ({ bannerTitle = 'INVESTOR<br/>RELATIONS' }) => {
    const [line1, line2] = bannerTitle.split('<br/>');

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
            <div className='relative flex items-center justify-center px-4 md:px-8 lg:px-16 xl:px-[40px] py-8 md:py-12 lg:py-16 xl:py-[52px] w-full max-w-[1920px] mx-auto min-h-[400px] md:min-h-[500px] lg:min-h-[567px]'>

                {/* Main text content */}
                <div className='relative flex flex-col justify-center w-full max-w-[1200px]'>
                    <div 
                        className='text-black futura-condensed-medium font-medium text-[48px] md:text-[60px] lg:text-[100px] xl:text-[170px] leading-[1.1] md:tracking-[4%] lg:tracking-[6%] xl:tracking-[8%] uppercase tracking-[1rem] mb-4 md:mb-6 lg:mb-8 banner-text line1-width text-left sm:text-left'
                        dangerouslySetInnerHTML={{ __html: line1 }}
                    />
                
                    <div 
                        className='text-black futura-condensed-medium font-medium text-[48px] md:text-[60px] lg:text-[100px] xl:text-[170px] leading-[1.1] md:tracking-[4%] lg:tracking-[6%] xl:tracking-[8%] uppercase tracking-[1rem] banner-text whitespace-normal break-words !text-right'
                        style={{ '--line1-width': `${line1.length}ch` }}
                        dangerouslySetInnerHTML={{ __html: line2 }}
                    />
                </div>
            </div>
        </div>
    );
};

export default InvestorRelationsBanner;
