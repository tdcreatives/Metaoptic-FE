import React from 'react';
import IRContainer from '@/layouts/investor-relations/container';

const ColumnHeading = ({ children }) => (
    <div className='futura-condensed-medium font-medium text-[#231F20] text-[20px] md:text-[24px] xl:text-[28px] mb-5 md:mb-6'>
        {children}
    </div>
);

const AddressBlock = ({ label, lines }) => (
    <div className='mb-5 md:mb-6 last:mb-0'>
        <div className='futura-medium font-medium text-[#d34c39] text-[16px] md:text-[18px] xl:text-[20px] mb-1'>
            {label}
        </div>
        {lines.map((line, idx) => (
            <div key={idx} className='futura-medium font-medium text-[16px] md:text-[18px] xl:text-[20px] text-[#616161] leading-[1.6]'>
                {line}
            </div>
        ))}
    </div>
);

const IRContacts = () => {
    return (
        <IRContainer className='py-12 md:py-16 lg:py-20 xl:pt-[60px]'>
            <h2 className='futura-condensed-medium font-medium text-black uppercase text-[28px] md:text-[36px] xl:text-[48px] leading-tight border-b border-[#BFBFBF] pb-4 md:pb-5 lg:pb-6'>
                Investor Relations
            </h2>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12 lg:gap-16 xl:gap-20 mt-8 md:mt-10 lg:mt-12'>
                <div>
                    <ColumnHeading>Headquarters</ColumnHeading>
                    <AddressBlock
                        label='Singapore (HQ)'
                        lines={[
                            'Metaoptics Technologies Pte Ltd.',
                            '81 Ayer Rajah Crescent, #01-45',
                            'Singapore 139967',
                        ]}
                    />
                    <AddressBlock
                        label='United States'
                        lines={[
                            'Metaoptics Inc. 1 Ferry Building,',
                            'Suite 201 San Francisco, CA',
                            '94111',
                        ]}
                    />
                </div>

                <div>
                    <ColumnHeading>Investor Relations</ColumnHeading>
                    <div className='futura-medium font-medium text-[16px] md:text-[18px] xl:text-[20px] text-[#616161] leading-[1.8]'>
                        <div>Gateway Group</div>
                        <a
                            href='mailto:MOT@gateway-grp.com'
                            className='text-[#616161] underline hover:text-[#d34c39] transition-colors'
                        >
                            MOT@gateway-grp.com
                        </a>
                        <div>
                            <a href='tel:+19495743860' className='hover:text-[#d34c39] transition-colors'>
                                949-574-3860
                            </a>
                        </div>
                    </div>
                </div>

                <div>
                    <ColumnHeading>Depository Bank</ColumnHeading>
                    <div className='futura-medium font-medium text-[16px] md:text-[18px] xl:text-[20px] text-[#616161] leading-[1.6]'>
                        JPMorgan Chase Bank, N.A.
                    </div>
                </div>
            </div>
        </IRContainer>
    );
};

export default IRContacts;
