'use client';

import React from 'react';
import BaseTitle from '@/components/BaseTitle';

const HeroTitle = ({ title, subtitle }) => {
    return (
        <div className='mx-auto xl:px-[72px] px-[48px] xl:py-[48px] py-[24px] bg-[#E0E0E0]'>
            <BaseTitle
                title={title}
                className='!text-center futura-condensed-medium'
            />

            <div className='xl:text-[40px] text-[24px] tracking-[0.1rem] font-normal text-[#231f20] text-center'>
                {subtitle}
            </div>
        </div>
    );
};

export default HeroTitle;
