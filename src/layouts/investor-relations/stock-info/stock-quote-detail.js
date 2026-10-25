'use client';

import React, { useEffect, useState } from 'react';
import { fetchStockQuote } from '@/lib/b2i';
import IRContainer from '@/layouts/investor-relations/container';

const isNegative = (value) => typeof value === 'string' && value.trim().startsWith('-');

const ChangeText = ({ net, percent, className = '' }) => {
    if (!net && !percent) return null;
    const negative = isNegative(net) || isNegative(percent);
    return (
        <div className={`${negative ? 'text-[#d34c39]' : 'text-[#1FAB55]'} ${className}`}>
            {net && !net.startsWith('-') ? `+${net}` : net} ({percent && !percent.startsWith('-') ? `+${percent}` : percent})
        </div>
    );
};

const MetricCell = ({ label, value }) => (
    <div className='flex flex-col gap-2 py-4 border-b border-[#E0E1E0]'>
        <div className='futura-medium font-medium text-[14px] md:text-[16px] xl:text-[20px] text-[#888888]'>{label}</div>
        <div className='futura-medium font-medium text-[14px] md:text-[16px] xl:text-[20px] text-black'>{value || '—'}</div>
    </div>
);

const StockQuoteDetail = () => {
    const [quote, setQuote] = useState(null);

    useEffect(() => {
        const bizId = process.env.NEXT_PUBLIC_B2I_BIZ_ID;
        const apiKey = process.env.NEXT_PUBLIC_B2I_API_KEY;
        const symbol = process.env.NEXT_PUBLIC_B2I_SYMBOL || 'MOT';

        let cancelled = false;
        (async () => {
            const data = await fetchStockQuote({ bizId, apiKey, symbol });
            if (!cancelled) setQuote(data);
        })();
        return () => { cancelled = true; };
    }, []);

    const exchange = quote?.exchange || 'NASDAQ';
    const symbol = quote?.symbol || process.env.NEXT_PUBLIC_B2I_SYMBOL || 'MOT';

    return (
        <IRContainer className='py-12 md:py-16 lg:py-20'>
            <h2 className='futura-condensed-medium font-medium text-black uppercase text-[28px] md:text-[36px] xl:text-[48px] leading-tight border-b border-[#BFBFBF] pb-4 md:pb-5 lg:pb-6'>
                Stock Quote
            </h2>

            <div className='grid grid-cols-1 lg:grid-cols-[260px_1fr] xl:grid-cols-[320px_1fr] gap-8 lg:gap-x-16 mt-8 md:mt-10 lg:mt-12 items-center lg:px-[80px]'>
                <div className='flex flex-col'>
                    <div className='futura-medium font-medium text-[14px] md:text-[16px] xl:text-[20px] text-[#888888] uppercase'>
                        {exchange}: {symbol}
                    </div>

                    <div className='futura-condensed-medium font-medium text-black text-[40px] md:text-[48px] xl:text-[56px] leading-none mt-3 md:mt-4'>
                        {quote?.price || '$0.00'}
                    </div>

                    <ChangeText
                        net={quote?.changeNet || '0.00'}
                        percent={quote?.changePercent || '0.00%'}
                        className='futura-medium font-medium text-[14px] md:text-[16px] mt-3 md:mt-4'
                    />

                    {quote?.updatedAt && (
                        <div className='flex items-center gap-2 mt-3 md:mt-4'>
                            <span className='w-2 h-2 rounded-full bg-[#1FAB55] shrink-0' />
                            <span className='futura-medium font-medium text-[14px] md:text-[16px] xl:text-[20px] text-[#111111]'>{quote.updatedAt}</span>
                        </div>
                    )}
                </div>

                <div className='ir-horizontal-scroll xl:overflow-visible'>
                    <div className='grid grid-cols-2 gap-x-8 md:gap-x-16 xl:gap-x-24 gap-y-8 md:gap-y-10 min-w-[320px] xl:min-w-0'>
                    <MetricCell label='Volume' value={quote?.volume} />
                    <MetricCell label='Day Range' value={quote?.dayRange} />
                    <MetricCell label='52 Week Range' value={quote?.yearRange} />
                    <MetricCell label='Market Cap' value={quote?.marketCap} />
                    <MetricCell label='Open' value={quote?.open} />
                    <MetricCell label='Previous Close' value={quote?.previousClose} />
                    <MetricCell label='Shares Outstanding' value={quote?.sharesOutstanding} />
                    </div>
                </div>
            </div>
        </IRContainer>
    );
};

export default StockQuoteDetail;
