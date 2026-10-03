import React from 'react';
import IRContainer from '@/layouts/investor-relations/container';

const MOCK_ANALYSTS = [
    { id: 'a-1', firm: 'Cantor Fitzgerald', analyst: 'Jonathan Ruykhaver' },
    { id: 'a-2', firm: 'Citizens', analyst: 'Trevor Walsh' },
    { id: 'a-3', firm: 'Craig-Hallum Capital Group LLC', analyst: 'Jeremy Hamblin' },
    { id: 'a-4', firm: 'Lake Street Capital Markets, LLC', analyst: 'Eric Martinuzzi' },
    { id: 'a-5', firm: 'Northland Capital Markets', analyst: 'Mike Latimore' },
    { id: 'a-6', firm: 'ROTH Capital Partners', analyst: 'Richard Baldry' },
];

const HeaderCell = ({ children }) => (
    <div className='futura-medium font-medium text-[18px] md:text-[22px] xl:text-[28px] text-[#231F20]'>
        {children}
    </div>
);

const BodyCell = ({ children }) => (
    <div className='futura-medium font-medium text-[14px] md:text-[16px] xl:text-[20px] text-black'>
        {children}
    </div>
);

const AnalystCoverage = () => {
    return (
        <IRContainer className='py-12 md:py-16 lg:py-20'>
            <h2 className='futura-condensed-medium font-medium text-black uppercase text-[28px] md:text-[36px] xl:text-[48px] leading-tight border-b border-[#BFBFBF] pb-4 md:pb-5 lg:pb-6'>
                Analyst Coverage
            </h2>

            <div className='mt-8 md:mt-10 lg:mt-12 ir-horizontal-scroll'>
                <div className='min-w-[600px]'>
                    <div className='grid grid-cols-2 gap-x-8 md:gap-x-16 py-5 md:py-6 px-6 md:px-8 bg-[#F2F2F2]'>
                        <HeaderCell>Firm</HeaderCell>
                        <HeaderCell>Analyst</HeaderCell>
                    </div>

                    {MOCK_ANALYSTS.map((item) => (
                        <div
                            key={item.id}
                            className='grid grid-cols-2 gap-x-8 md:gap-x-16 py-5 md:py-6 px-6 md:px-8 border-b border-[#E0E1E0]'
                        >
                            <BodyCell>{item.firm}</BodyCell>
                            <BodyCell>{item.analyst}</BodyCell>
                        </div>
                    ))}
                </div>
            </div>
        </IRContainer>
    );
};

export default AnalystCoverage;
