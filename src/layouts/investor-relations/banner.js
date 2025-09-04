'use client';

import React, { useEffect, useCallback, useState } from 'react';
import { gsap } from 'gsap';
import items from '@/constants/investor-relations.json';
import BaseButton from '@/components/BaseButton';
import './banner.scss';

const InvestorRelationsBanner = () => {
    return (
        <div className='relative w-full bg-[#F0F0F0] pb-20 overflow-hidden investor-relations-banner'>
            {/* Background logo images */}
            <div 
                className='absolute top-0 right-0 w-[200px] h-[200px] md:w-[300px] md:h-[300px] lg:w-[400px] lg:h-[400px] xl:w-[450px] xl:h-[450px] bg-cover bg-no-repeat bg-center  banner-logo bg-[url(/investor-relations/logo-top-right.png)] bg-top-right'
            />
            <div 
                className='absolute bottom-0 left-0 w-[200px] h-[200px] md:w-[250px] md:h-[250px] lg:w-[400px] lg:h-[400px] xl:w-[450px] xl:h-[450px] bg-cover bg-no-repeat bg-center banner-logo bg-[url(/investor-relations/logo-bottom-left.png)] bg-bottom-left'
            />
            
            {/* Main container with proper padding and dimensions */}
            <div className='relative flex justify-center items-center px-4 md:px-8 lg:px-16 xl:px-[199px] py-8 md:py-12 lg:py-16 xl:py-[52px] w-full max-w-[1920px] mx-auto min-h-[400px] md:min-h-[500px] lg:min-h-[567px]'>
                
                {/* Main text content */}
                <div className='relative flex flex-col justify-center items-center text-center'>
                    {/* INVESTOR text */}
                    <div 
                        className='text-black futura-condensed-medium font-medium text-[48px] md:text-[72px] lg:text-[120px] xl:text-[172px] leading-[1.1] tracking-[2%] md:tracking-[4%] lg:tracking-[6%] xl:tracking-[8%] uppercase  mb-4 md:mb-6 lg:mb-8 banner-text'
                        style={{
                            maxWidth: '100%'
                        }}
                    >
                        INVESTOR
                    </div>
                    
                    {/* RELATIONS text */}
                    <div 
                        className='text-black futura-condensed-medium font-medium text-[48px] md:text-[72px] lg:text-[120px] xl:text-[172px] leading-[0.95] tracking-[2%] md:tracking-[4%] lg:tracking-[6%] xl:tracking-[8%] uppercase  banner-text'
                        style={{
                            maxWidth: '100%'
                        }}
                    >
                        RELATIONS
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvestorRelationsBanner;
