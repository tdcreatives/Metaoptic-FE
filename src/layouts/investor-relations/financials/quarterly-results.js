import React from 'react';
import IRContainer from '@/layouts/investor-relations/container';

const buildQuarter = (label, year) => ({
    label,
    items: [
        { title: `Form 6-K Filing - ${label} ${year}`, actions: [{ label: 'HTML', url: '#' }, { label: 'PDF', url: '#' }] },
        { title: `Earnings Release - ${label} ${year}`, actions: [{ label: 'Audio', url: '#' }] },
        { title: `Earnings Call Webcast - ${label} ${year}`, actions: [{ label: 'Webcast', url: '#' }] },
    ],
});

const QUARTERLY_DATA = [
    {
        year: 2026,
        quarters: [buildQuarter('Q3', 2026), buildQuarter('Q2', 2026), buildQuarter('Q1', 2026)],
    },
    {
        year: 2025,
        quarters: [buildQuarter('Q3', 2025), buildQuarter('Q2', 2025), buildQuarter('Q1', 2025)],
    },
];

const LinkPill = ({ label, url }) => (
    <a
        href={url || '#'}
        target={url && url !== '#' ? '_blank' : undefined}
        rel={url && url !== '#' ? 'noopener noreferrer' : undefined}
        className='inline-flex items-center justify-center px-[6px] py-[4px] min-w-[48px] bg-[#F2F2F2] hover:bg-[#E5E5E5] border border-[#D9D9D9] text-[12px] md:text-[13px] futura-medium text-[#231F20] transition-colors rounded-[2px] whitespace-nowrap'
    >
        {label}
    </a>
);

const QuarterItem = ({ item }) => (
    <div className='flex items-center justify-between gap-4 py-4 border-b border-[#E0E1E0]'>
        <span className='futura-medium font-medium text-[14px] md:text-[15px] xl:text-[16px] text-[#231F20]'>
            {item.title}
        </span>
        <div className='flex items-center gap-2 shrink-0'>
            {item.actions.map((action) => (
                <LinkPill key={action.label} label={action.label} url={action.url} />
            ))}
        </div>
    </div>
);

const QuarterBlock = ({ quarter }) => (
    <div>
        <h3 className='futura-condensed-medium font-medium uppercase text-[20px] md:text-[22px] xl:text-[24px] text-[#231F20] mb-4 md:mb-6'>
            {quarter.label}
        </h3>
        <div>
            {quarter.items.map((item, idx) => (
                <QuarterItem key={idx} item={item} />
            ))}
        </div>
    </div>
);

const YearBlock = ({ yearData }) => (
    <div className='mb-12 md:mb-16 last:mb-0'>
        <h2 className='futura-condensed-medium font-medium uppercase text-[32px] md:text-[40px] xl:text-[48px] text-[#231F20] border-b border-[#BFBFBF] pb-4 md:pb-5 lg:pb-6'>
            {yearData.year}
        </h2>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-12 xl:gap-x-16 gap-y-10 md:gap-y-12 mt-8 md:mt-10'>
            {yearData.quarters.map((q) => (
                <QuarterBlock key={q.label} quarter={q} />
            ))}
        </div>
    </div>
);

const QuarterlyResults = () => {
    return (
        <IRContainer className='py-12 md:py-16 lg:py-20'>
            {QUARTERLY_DATA.map((yearData) => (
                <YearBlock key={yearData.year} yearData={yearData} />
            ))}
        </IRContainer>
    );
};

export default QuarterlyResults;
