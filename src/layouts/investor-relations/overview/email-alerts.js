import React from 'react';
import Link from 'next/link';
import IRContainer from '@/layouts/investor-relations/container';

const EmailAlerts = () => {
    return (
        <IRContainer className='py-12 md:py-16 lg:py-20 xl:pt-[60px]'>
            <h2 className='futura-condensed-medium font-medium text-black uppercase text-[28px] md:text-[36px] xl:text-[48px] leading-tight border-b border-[#BFBFBF] pb-4 md:pb-5 lg:pb-6'>
                Email Alerts
            </h2>

            <p className='futura-medium font-medium text-[#231F20] text-[14px] md:text-[16px] xl:text-[20px] leading-[1.6] mt-6 md:mt-8 lg:mt-10'>
                Sign up today and receive company updates straight to your inbox.
            </p>

            <div className='mt-6 md:mt-8'>
                <Link
                    href='/investor-relations/resources/email-alerts'
                    className='inline-block bg-[#d34c39] hover:bg-[#231f20] text-white uppercase tracking-wider futura-medium text-[14px] md:text-[16px] px-10 md:px-12 py-3 md:py-4 rounded-full transition-colors'
                >
                    Sign Up Today
                </Link>
            </div>
        </IRContainer>
    );
};

export default EmailAlerts;
