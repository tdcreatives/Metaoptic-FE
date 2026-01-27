'use client';

import React from 'react';
import Image from 'next/image';

const Footer = () => {
    return (
        <div className='bg-[#131313] futura-book px-[5.2vw] pt-4 pb-8 relative'>
            <div className='flex justify-between'>
                <div className='flex flex-col'>
                    <p className='text-[#888888] tracking-wider xl:text-[84px] text-[48px] futura-condensed-medium uppercase'>
                        Connect with us
                    </p>

                    <p className='text-[#d44c39] futura-medium xl:text-[24px] text-[18px] xl:mt-[-16px] mt-0'>
                        Metaoptics Technologies Pte Ltd
                    </p>

                    <div className='futura-book xl:text-[20px] text-[18px] xl:mt-8 mt-4'>
                        <a href='mailto:sales@metaoptics.sg'>
                            <p className='text-[#E0E1E0] mt-2'>
                                {' '}
                                <span className='text-[#888888]'>Email: </span>
                                sales@metaoptics.sg
                            </p>
                        </a>
                        <a href='tel:+6582180482'>
                            <p className='text-[#E0E1E0] mt-2'>
                                {' '}
                                <span className='text-[#888888]'>Phone: </span>
                                +65 8218 0482
                            </p>
                        </a>
                        <p className='text-[#E0E1E0] mt-2'>
                            <span className='text-[#888888]'>Address: </span>81 Ayer Rajah
                            Crescent 01-45 Singapore 139967
                        </p>
                    </div>
                </div>
            </div>

            <div className='flex xl:flex-row flex-col xl:gap-0 gap-10 justify-between xl:mt-[40px] mt-5 w-full'>
                <div className='flex gap-5 xl:flex-row flex-col text-white xl:text-[18px] text-[14px] futura-medium'>
                    <div>
                        <a href='javascript:void()' onClick={() => window.scrollTo(0, 0)}>
                            Back to Top
                        </a>
                    </div>
                    <div>
                        <a href='/products'>Our Products</a>
                    </div>
                    {/* <div>Our Story</div>
                    <div>Gallery</div> */}
                    <div>
                        <a href='/contact-us'>Contact Us</a>
                    </div>
                </div>

                 <div className='flex xl:gap-8 gap-5 text-white xl:text-[18px] text-[14px] futura-medium'>
                    <div>
                        <a href='/privacy-policy'>Privacy Policy</a>
                    </div>
                    {/* <div>Connect</div>
                    <Image
                        src='/facebook.svg'
                        alt='Facebook'
                        width={0}
                        height={0}
                        sizes='100vw'
                        className='xl:w-[16px] w-[12px]'
                    />

                    <Image
                        src='/instagram.svg'
                        alt='Facebook'
                        width={0}
                        height={0}
                        sizes='100vw'
                        className='xl:w-[32px] w-[24px]'
                    />

                    <Image
                        src='/twitter.svg'
                        alt='Facebook'
                        width={0}
                        height={0}
                        sizes='100vw'
                        className='xl:w-[32px] w-[24px]'
                    /> */}
                </div> 
            </div>

            <div className='w-full h-[2px] my-2 bg-white'></div>

            <div className='flex xl:flex-row flex-col xl:justify-between justify-start text-[#868686] xl:text-[16px] text-[14px] uppercase tracking-widest'>
                <div>Metaoptics Technologies Pte Ltd. All rights reserved</div>
                <div>
                    Site by{' '}
                    <a
                        className='text-[#868686] hover:text-[#fff] hover:underline'
                        href='https://tdcreatives.asia/'
                        target='_blank'
                        rel='noopener noreferrer'>
                        TDCreatives.asia
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Footer;
