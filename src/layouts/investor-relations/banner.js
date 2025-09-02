'use client';

import React, { useEffect, useCallback, useState } from 'react';
import { gsap } from 'gsap';
import items from '@/constants/investor-relations.json';
import BaseButton from '@/components/BaseButton';
import './banner.scss';

const InvestorRelationsBanner = () => {
    return (
        <div className='relative w-full min-h-[calc(100vh-300px)]  bg-[#F0F0F0] pb-[60px] bg-[url(/investor-relations/logo-top-right.png), url(/investor-relations/logo-bottom-left.png)] bg-[position:right_top,left_bottom] bg-no-repeat bg-contain'>
            <div
                className='absolute text-[#000] xl:text-[150px] text-[70px] xl:left-[-20px] left-0 !top-[100px] futura-condensed-medium uppercase tracking-[1rem] w-full '
                
                style={{
                    whiteSpace: 'nowrap',
                }}>
                    <div class="name-dom-first-line">INVESTOR</div>
                    <br/> 
                    <div class="name-dom-second-line">RELATIONS</div>
            </div>
            
        </div>
    );
};

export default InvestorRelationsBanner;
