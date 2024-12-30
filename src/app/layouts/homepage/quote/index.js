'use client';

import React from 'react';
import Image from 'next/image';

const Quote = () => {
    return (
        <div className='h-[70vh] flex items-center justify-center'>
            <Image
                src='/quote.png'
                width={0}
                height={0}
                sizes='100vw'
                className='w-1/2 mx-auto'
                alt='Quote'
            />
        </div>
    );
};

export default Quote;
