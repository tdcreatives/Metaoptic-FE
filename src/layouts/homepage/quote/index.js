'use client';

import React from 'react';
import Image from 'next/image';

const Quote = () => {
    return (
        <div className='xl:h-[70vh] h-[40vh] flex items-center justify-center'>
            <Image
                src='/quote.png'
                width={0}
                height={0}
                sizes='100vw'
                className='xl:w-1/2 w-[80%] mx-auto'
                alt='Quote'
            />
        </div>
    );
};

export default Quote;
