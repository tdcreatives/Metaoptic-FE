import React from 'react';

import Image from 'next/image';

const ProductDetailsBanner = ({ product }) => {
    return (
        <div className='relative w-full min-h-[calc(100vh-100px)] overflow-hidden bg-[#F0F0F0]'>
            <div
                className='absolute text-white text-[300px] left-[-30px] top-[-60px] futura-condensed-medium uppercase tracking-widest'
                dangerouslySetInnerHTML={{ __html: product?.nameDom }}
                style={{
                    whiteSpace: 'nowrap',
                }}></div>

            <div className='mt-[-60px] relative z-100'>
                <div>
                    <Image
                        width='0'
                        height='0'
                        sizes='100vw'
                        src={product?.image}
                        alt='Next'
                        className='w-[50vw] relative z-100 mx-auto cursor-pointer hover:scale-105 transition-transform duration-300'
                    />
                </div>

                <div className='xl:text-[72px] text-[64px] text-[#d34c39] uppercase text-center relative z-30 futura-condensed-medium max-w-[70%] mx-auto mt-[-80px]'>
                    {product?.name}
                </div>

                <div className='text-[32px] futura-medium text-center'>
                    {product?.details?.subtitle}
                </div>

                <div className='text-[24px] text-center max-w-[60%] mx-auto mt-5'>
                    {product?.details?.description}
                </div>

                <div className='flex xl:justify-center justify-center xl:mt-10 mt-6 mb-[60px]'>
                    <button className='bg-[#d34c39] text-white font-bold px-10 py-3 rounded-full futura-medium xl:tracking-[4px] tracking-[2px] xl:text-[20px] text-[16px]'>
                        BUY
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailsBanner;
