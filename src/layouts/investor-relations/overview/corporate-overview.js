import React from 'react';
import IRContainer from '@/layouts/investor-relations/container';

const CorporateOverview = () => {
    return (
        <IRContainer className='py-12 md:py-16 lg:py-20 xl:pb-[60px]'>
            <h2 className='futura-condensed-medium font-medium text-black uppercase text-[28px] md:text-[36px] xl:text-[48px] leading-tight border-b border-[#BFBFBF] pb-4 md:pb-5 lg:pb-6'>
                Corporate Overview
            </h2>
            <p className='futura-medium font-medium text-black text-justify mt-6 md:mt-8 lg:mt-10 text-[14px] md:text-[16px] xl:text-[20px] leading-[1.6]'>
                MetaOptics Technologies is a pioneering company in the field of metalens and flat optics technology. Headquartered in Singapore with a U.S. presence in San Francisco, the company is dedicated to pushing the boundaries of what is possible in optical applications, delivering next-generation solutions for industries ranging from consumer electronics to defense and aerospace.
            </p>
        </IRContainer>
    );
};

export default CorporateOverview;
