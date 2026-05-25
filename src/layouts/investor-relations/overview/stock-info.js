'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
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
    <div className='flex flex-col gap-3'>
        <div className='futura-medium text-[14px] md:text-[16px] text-[#888888]'>{label}</div>
        <div className='futura-medium text-[14px] md:text-[16px] text-[#231F20]'>{value || '—'}</div>
    </div>
);

const StockInfo = () => {
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
        <IRContainer className='py-12 md:py-16 lg:py-20 xl:pt-[60px]'>
            <h2 className='futura-condensed-medium font-medium text-black uppercase text-[28px] md:text-[36px] xl:text-[48px] leading-tight border-b border-[#BFBFBF] pb-4 md:pb-5 lg:pb-6'>
                Stock Info
            </h2>

            <div className='grid grid-cols-1 lg:grid-cols-[260px_1fr] xl:grid-cols-[320px_1fr] gap-8 lg:gap-16 xl:gap-24 mt-8 md:mt-10 lg:mt-12 items-start'>
                <div className='flex flex-col'>
                    <div className='futura-medium text-[14px] md:text-[16px] text-[#888888] uppercase'>
                        {exchange}: {symbol}
                    </div>

                    <div className='futura-condensed-medium font-medium text-[#231F20] text-[48px] md:text-[60px] xl:text-[72px] leading-none mt-3 md:mt-4'>
                        {quote?.price || '$0.00'}
                    </div>

                    <ChangeText
                        net={quote?.changeNet || '0.00'}
                        percent={quote?.changePercent || '0.00%'}
                        className='futura-medium text-[14px] md:text-[16px] mt-3 md:mt-4'
                    />

                    {quote?.updatedAt && (
                        <div className='flex items-center gap-2 mt-3 md:mt-4'>
                            <span className='w-2 h-2 rounded-full bg-[#1FAB55] shrink-0' />
                            <span className='futura-medium text-[14px] md:text-[16px] text-[#231F20]'>{quote.updatedAt}</span>
                        </div>
                    )}
                </div>

                <div className='grid grid-cols-2 gap-x-8 md:gap-x-16 xl:gap-x-24 gap-y-8 md:gap-y-10'>
                    <MetricCell label='Volume' value={quote?.volume} />
                    <MetricCell label='Day Range' value={quote?.dayRange} />
                    <MetricCell label='52 Week Range' value={quote?.yearRange} />
                    <MetricCell label='Market Cap' value={quote?.marketCap} />
                </div>
            </div>

            <div className='mt-10 md:mt-12'>
                <Link
                    href='/investor-relations/stock-info'
                    className='inline-block bg-[#d34c39] hover:bg-[#231f20] text-white uppercase tracking-wider futura-medium text-[14px] md:text-[16px] px-10 md:px-12 py-3 md:py-4 rounded-full transition-colors'
                >
                    View Full Stock Info
                </Link>
            </div>
        </IRContainer>
    );
};

export default StockInfo;
