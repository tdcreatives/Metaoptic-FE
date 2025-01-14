import React from 'react';

import Image from 'next/image';

import BaseButton from '@/components/BaseButton';
import BaseTitle from '@/components/BaseTitle';

import './index.scss';

const ProductDetailsBanner = ({ product }) => {
    const handleOnBuyNow = () => {
        window.location.href = product?.buyNow;
    };

    return (
        <div className='relative w-full min-h-[calc(100vh-100px)] overflow-hidden bg-[#F0F0F0] pb-[60px]'>
            <div
                className='absolute text-white xl:text-[200px] text-[100px] xl:left-[-20px] left-0 xl:top-[-60px] top-0 futura-condensed-medium uppercase tracking-[1rem] w-full'
                dangerouslySetInnerHTML={{ __html: product?.nameDom }}
                style={{
                    whiteSpace: 'nowrap',
                }}></div>

            <div className='relative z-100'>
                <div>
                    <Image
                        width='0'
                        height='0'
                        sizes='100vw'
                        src={product?.image}
                        alt='Next'
                        className='xl:h-[450px] xl:w-auto w-[90%] relative z-100 mx-auto cursor-pointer hover:scale-105 transition-transform duration-300 object-contain'
                    />
                </div>

                <div className='xl:text-[60px] text-[36px] text-[#d34c39] uppercase text-center relative z-30 futura-condensed-medium xl:max-w-[70%] max-w-[90%] mx-auto xl:mt-0 mt-3'>
                    {product?.name}
                </div>

                <div className='xl:text-[28px] text-[20px] futura-medium text-center xl:max-w-[70%] mx-auto max-w-[90%]'>
                    {product?.details?.subtitle}
                </div>

                <div className='xl:text-[20px] text-[16px] text-center xl:max-w-[60%] max-w-[90%] mx-auto mt-5'>
                    {product?.details?.description}
                </div>

                {product?.buyNow && (
                    <BaseButton label='BUY' onClick={handleOnBuyNow} className='!mb-0' />
                )}
            </div>
        </div>
    );
};

export default ProductDetailsBanner;
