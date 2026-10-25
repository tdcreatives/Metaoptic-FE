'use client';

import React, { useEffect, useState } from 'react';
import { fetchStockQuote } from '@/lib/b2i';
import IRContainer from '@/layouts/investor-relations/container';

const InfoRow = ({ label, value }) => (
    <div className='flex justify-between items-baseline gap-4 py-3 border-b border-[#E0E1E0]'>
        <span className='futura-medium font-medium text-[14px] md:text-[16px] xl:text-[20px] text-[#888888]'>
            {label}
        </span>
        <span className='futura-medium font-medium text-[14px] md:text-[16px] xl:text-[20px] text-black'>
            {value || '—'}
        </span>
    </div>
);

const SubsectionHeader = ({ title, timestamp }) => (
    <div className='flex flex-wrap justify-between items-baseline gap-2 mb-4'>
        <h3 className='futura-medium font-medium text-[18px] md:text-[20px] text-[#231F20]'>{title}</h3>
        {timestamp && (
            <span className='futura-medium text-[13px] md:text-[14px] text-[#888888]'>{timestamp}</span>
        )}
    </div>
);

const DetailedInformation = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        const bizId = process.env.NEXT_PUBLIC_B2I_BIZ_ID;
        const apiKey = process.env.NEXT_PUBLIC_B2I_API_KEY;
        const symbol = process.env.NEXT_PUBLIC_B2I_SYMBOL || 'MOT';

        let cancelled = false;
        (async () => {
            const result = await fetchStockQuote({ bizId, apiKey, symbol, format: '10' });
            if (!cancelled) setData(result);
        })();
        return () => { cancelled = true; };
    }, []);

    const today = data?.today || {};
    const shareInfo = data?.shareInfo || {};

    return (
        <IRContainer className='py-12 md:py-16 lg:py-20'>
            <h2 className='futura-condensed-medium font-medium text-black uppercase text-[28px] md:text-[36px] xl:text-[48px] leading-tight border-b border-[#BFBFBF] pb-4 md:pb-5 lg:pb-6'>
                Detailed Information
            </h2>

            <div className='mt-8 md:mt-10 lg:mt-12 lg:px-[80px]'>
                <SubsectionHeader title='Today' timestamp={today.updatedAt} />

                <div className='grid grid-cols-1 md:grid-cols-3 gap-x-16'>
                    <InfoRow label='Last' value={today.last} />
                    <InfoRow label='Volume' value={today.volume} />
                    <InfoRow label='Change' value={today.change} />
                    <InfoRow label='% Chg' value={today.changePercent} />
                    <InfoRow label='Open' value={today.open} />
                    <InfoRow label='Prev. Close' value={today.prevClose} />
                    <InfoRow label='High' value={today.high} />
                    <InfoRow label='Low' value={today.low} />
                    <InfoRow label='Bid' value={today.bid} />
                    <InfoRow label='Bid Size' value={today.bidSize} />
                    <InfoRow label='Ask' value={today.ask} />
                    <InfoRow label='Ask Size' value={today.askSize} />
                </div>

                <div className='mt-10 md:mt-12'>
                    <SubsectionHeader title='Share Information' />

                    <div className='grid grid-cols-1 md:grid-cols-3 gap-x-16'>
                        <InfoRow label='Year High' value={shareInfo.yearHigh} />
                        <InfoRow label='Year Low' value={shareInfo.yearLow} />
                        <InfoRow label='Exchange' value={shareInfo.exchange} />
                        <InfoRow label='Shares Out' value={shareInfo.shares} />
                        <InfoRow label='Market Cap' value={shareInfo.marketCap} />
                        <InfoRow label='PB Ratio' value={shareInfo.pbRatio} />
                    </div>
                </div>
            </div>
        </IRContainer>
    );
};

export default DetailedInformation;
