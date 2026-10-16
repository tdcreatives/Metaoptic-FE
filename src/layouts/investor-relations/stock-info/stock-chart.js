'use client';

import React, { useEffect } from 'react';
import Script from 'next/script';
import IRContainer from '@/layouts/investor-relations/container';

const SCRIPT_URL = 'https://www.b2i.us/b2i/ChartApi_20.asp?v=1.0.6';

const initChart = () => {
    if (typeof window === 'undefined') return;
    if (!window.oChart || typeof window.GetChart !== 'function') return;
    window.oChart.BizID = process.env.NEXT_PUBLIC_B2I_BIZ_ID;
    window.oChart.sKey = process.env.NEXT_PUBLIC_B2I_API_KEY;
    window.oChart.Symbol = process.env.NEXT_PUBLIC_B2I_SYMBOL || 'MOT';
    window.oChart.sDiv = 'StockChartDiv';
    window.GetChart();
};

const StockChart = () => {
    useEffect(() => {
        initChart();
    }, []);

    return (
        <IRContainer className='py-12 md:py-16 lg:py-20'>
            <h2 className='futura-condensed-medium font-medium text-black uppercase text-[28px] md:text-[36px] xl:text-[48px] leading-tight border-b border-[#BFBFBF] pb-4 md:pb-5 lg:pb-6'>
                Stock Chart
            </h2>

            <div className='mt-8 md:mt-10 lg:mt-12 lg:px-[80px]'>
                <div className='relative w-full h-[500px] overflow-hidden'>
                    <div id='StockChartDiv' className='absolute inset-0' />
                </div>
            </div>

            <Script
                src={SCRIPT_URL}
                strategy='afterInteractive'
                onLoad={initChart}
            />
        </IRContainer>
    );
};

export default StockChart;
