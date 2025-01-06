import React from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import BaseButton from '@/components/BaseButton';

const FindMore = () => {
    const router = useRouter();

    return (
        <div className='relative'>
            <div className='w-full relative'>
                <Image
                    width='0'
                    height='0'
                    sizes='100vw'
                    className='w-full relative z-1'
                    src='/about-us/find-more.png'
                    alt='Find more'
                    style={{
                        transform: 'scale(1.01)',
                    }}
                />

                <div className='absolute top-1/2 left-1/2 text-white z-10 transform -translate-x-1/2 -translate-y-1/2 text-center'>
                    <div className='uppercase text-[24px] tracking-[0.4rem] font-normal'>
                        Check out
                    </div>

                    <div className='uppercase xl:text-[80px] text-[60px] tracking-[1rem] futura-condensed-medium'>
                        OUR PRODUCTS
                    </div>

                    <BaseButton
                        label='ALL PRODUCTS'
                        classNameBtn='uppercase'
                        className='mt-48px'
                        onClick={() => router.push('/products')}
                    />
                </div>
            </div>
        </div>
    );
};

export default FindMore;
