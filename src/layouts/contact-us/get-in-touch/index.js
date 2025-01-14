'use client';

import React from 'react';

import BaseTitle from '@/components/BaseTitle';

const GetInTouch = () => {
    return (
        <div className='xl:my-6 my-3'>
            <BaseTitle
                title='GET IN TOUCH'
                className='!text-center futura-condensed-medium'
            />

            {/* <div className='text-center shadow-[0_3px_10px_rgb(0,0,0,0.2)] xl:py-[64px] xl:w-[83%] mx-auto max-w-[1600px] w-[90%] xl:mt-0 mt-8 py-[32px] xl:px-0 px-4 '>
                <h3 className='xl:text-[72px] text-[40px] futura-condensed-medium mb-5'>
                    GET IN TOUCH
                </h3>
                <p className='xl:text-[24px] text-[18px] text-gray-600'>
                    Feel free to contact us any time. <br /> We will get back to you as
                    soon as we can!
                </p>

                <hr className='my-8 xl:w-[50%] w-[70%] mx-auto' />

                <div className='xl:text-[20px] text-[18px] text-[#121212] futura-medium'>
                    <div className='mb-4'>
                        81 Ayer Rajah Crescent 01-45 Singapore 139967
                    </div>
                    <div
                        className='text-[#d34c39] hover:underline cursor-pointer'
                        onClick={() => window.open('mailto:sales@metaoptics.com.sg')}>
                        sales@metaoptics.com.sg
                    </div>
                </div>
            </div> */}
        </div>
    );
};

export default GetInTouch;
