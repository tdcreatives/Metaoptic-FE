'use client';

import React, { useEffect, useCallback, useState } from 'react';
import { gsap } from 'gsap';
import items from '@/constants/investor-relations.json';
import BaseButton from '@/components/BaseButton';

const AnnualInterimReport = () => {
    return (
        <div className='w-full bg-[#dadada] xl:py-6 py-3 xl:px-6 px-3 rounded-lg text-[rgb(17,17,17)]'>
            {/* Specifications Title Row with Icon */}
            <div className='flex justify-between items-center mb-0'>
                <div className='xl:text-[48px] text-[32px] uppercase relative z-30 futura-condensed-medium xl:mt-0 mt-3 text-start'>
                    ANNUAL/ INTERIM REPORT
                </div>                
            </div>

            <div className='w-full h-[2px] bg-[rgba(17,17,17,1)] mx-auto mb-8'></div>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-12 !mt-[80px]'>
                {items.map((item, index) => (
                    <div
                        key={item.id}
                        className='xl:mt-[10px] border-b-2 border-[#b5b5b5] pb-10'>
                        <div className='text-[24px] font-bold text-[#111111]'>{item.title}</div>
                        <BaseButton
                        label='DOWNLOAD PDF'
                        classNameBtn='uppercase !text-[#d34c39] hover:!text-white'
                        bgDefault='#fff'
                        className='!mt-[10px]'                        
                        onClick={() => window.open(item.link, '_blank')}
                    />
                    </div>
                ))}
            </div>

            
        </div>
    );
};

export default AnnualInterimReport;
