'use client';

import React from 'react';
import Image from 'next/image';

const Footer = () => {
    return (
        <div className='bg-[#131313] futura-book px-[5.2vw] pt-4 pb-8 relative'>
            <div className='flex justify-between'>
                <div className='flex flex-col'>
                    <p className='text-[#888888] tracking-wider xl:text-[150px] text-[24px] futura-condensed-medium uppercase'>
                        Connect with us
                    </p>

                    <p className='text-[#d44c39] futura-medium text-[30px] mt-[-16px]'>
                        Metaoptics Technologies Pte Ltd
                    </p>

                    <div className='futura-book text-[25px] mt-16'>
                        <a href='mailto:sales@metaoptics.sg'>
                            <p className='text-[#E0E1E0] mt-2'>
                                {' '}
                                <span className='text-[#888888]'>Email: </span>
                                sales@metaoptics.sg
                            </p>
                        </a>
                        <p className='text-[#E0E1E0]'>
                            <span className='text-[#888888]'>Address: </span>81 Ayer Rajah
                            Crescent 01-45 Singapore 139967
                        </p>
                    </div>
                </div>
            </div>

            <div className='flex justify-between mt-[160px] w-full'>
                <div className='flex gap-5 text-white text-[25px] futura-medium'>
                    <div>Back to Top</div>
                    <div>Our Products</div>
                    <div>Our Story</div>
                    <div>Gallery</div>
                    <div>Contact Us</div>
                </div>

                <div className='flex gap-8 text-white text-[25px] futura-medium'>
                    <div>Connect</div>
                    <Image
                        src='/facebook.svg'
                        alt='Facebook'
                        width={0}
                        height={0}
                        sizes='100vw'
                        className='w-[16px]'
                    />

                    <Image
                        src='/instagram.svg'
                        alt='Facebook'
                        width={0}
                        height={0}
                        sizes='100vw'
                        className='w-[32px]'
                    />

                    <Image
                        src='/twitter.svg'
                        alt='Facebook'
                        width={0}
                        height={0}
                        sizes='100vw'
                        className='w-[32px]'
                    />
                </div>
            </div>

            <div className='w-full h-[2px] my-4 bg-white'></div>

            <div className='text-center text-[#868686] text-[20px] uppercase tracking-widest'>
                Metaoptics Technologies Pte Ltd. All rights reserved
            </div>
        </div>
    );
};

export default Footer;
