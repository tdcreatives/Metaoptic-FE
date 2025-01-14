import React from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import BaseButton from '@/components/BaseButton';

const FindMore = () => {
    const router = useRouter();

    return (
        <div className='relative z-100'>
            <div className='w-full relative bg-find-more bg-cover bg-no-repeat'>
                <div className=' text-white z-10 text-center xl:py-[72px] py-[48px]'>
                    <div className='uppercase xl:text-[24px] text-[16px] tracking-[0.2rem] font-normal'>
                        Check out
                    </div>

                    <div className='uppercase xl:text-[72px] text-[48px] tracking-[0.5rem] futura-condensed-medium text-white'>
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
