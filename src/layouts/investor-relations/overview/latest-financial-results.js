import React from 'react';

const MOCK_FINANCIAL = {
    fiscalYearLabel: 'FY 2025',
    fiscalYearSubtitle: 'Fiscal Year Ended December 31, 2025',
    rows: [
        { id: 'earnings-release', label: 'Earnings Release', links: [{ type: 'HTML', url: '#' }, { type: 'PDF', url: '#' }] },
        { id: 'earnings-webcast', label: 'Earnings Webcast', links: [{ type: 'Audio', url: '#' }] },
        { id: '20-f',             label: '20-F',             links: [{ type: 'HTML', url: '#' }, { type: 'PDF', url: '#' }] },
        { id: 'xbrl',             label: 'XBRL',             links: [{ type: 'ZIP', url: '#' }] },
    ],
};

const FileLinkPill = ({ type, url }) => (
    <a
        href={url}
        target='_blank'
        rel='noopener noreferrer'
        className='inline-flex items-center justify-center px-3 py-1 min-w-[52px] bg-[#F2F2F2] hover:bg-[#E5E5E5] border border-[#D9D9D9] text-[12px] md:text-[13px] futura-medium font-medium text-[#231F20] transition-colors rounded-[2px]'
    >
        {type}
    </a>
);

const FinancialRow = ({ row }) => (
    <div className='flex items-center justify-between gap-4 py-4 md:py-5 border-b border-[#E5E5E5]'>
        <div className='futura-medium text-[14px] md:text-[16px] font-medium text-[#231F20]'>
            {row.label}
        </div>
        <div className='flex items-center gap-2'>
            {row.links.map((link) => (
                <FileLinkPill key={link.type} type={link.type} url={link.url} />
            ))}
        </div>
    </div>
);

const LatestFinancialResults = () => {
    const { fiscalYearLabel, fiscalYearSubtitle, rows } = MOCK_FINANCIAL;

    return (
        <section className='w-full max-w-[1920px] mx-auto px-4 md:px-8 lg:px-16 xl:px-[40px] py-12 md:py-16 lg:py-20 xl:pt-[60px]'>
            <h2 className='futura-condensed-medium font-medium text-black uppercase text-[28px] md:text-[36px] xl:text-[48px] leading-tight border-b border-[#BFBFBF] pb-4 md:pb-5 lg:pb-6'>
                Latest Financial Results
            </h2>

            <div className='grid grid-cols-1 lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_540px] gap-8 lg:gap-10 xl:gap-16 mt-6 md:mt-8 lg:mt-10 items-start'>
                <div className='flex flex-col'>
                    <div className='futura-medium text-[18px] md:text-[20px] font-medium text-[#231F20]'>
                        {fiscalYearLabel}
                    </div>
                    <div className='futura-medium text-[13px] md:text-[14px] font-medium text-[#888888] mt-2 mb-4 md:mb-6'>
                        {fiscalYearSubtitle}
                    </div>

                    <div>
                        {rows.map((row) => (
                            <FinancialRow key={row.id} row={row} />
                        ))}
                    </div>
                </div>

                <div className='w-full h-[240px] md:h-[280px] lg:h-[300px] xl:h-[340px] bg-[#D9D9D9] flex items-center justify-center'>
                    <span className='futura-medium text-[18px] md:text-[20px] text-[#888888]'>Placeholder Image</span>
                </div>
            </div>
        </section>
    );
};

export default LatestFinancialResults;
