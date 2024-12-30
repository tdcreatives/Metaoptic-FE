'use client';

import React from 'react';
import Image from 'next/image';

import './index.scss';

const BaseProductCard = ({ product }) => {
    return (
        <div className='px-4 py-[90px] product-card'>
            <div className='futura-condensed-medium text-[90px] product-card__id'>
                {product.id}
            </div>

            <div className='mt-10'>
                <Image
                    width={0}
                    height={0}
                    sizes='100vh'
                    src={`/${product?.image}`}
                    alt='Product'
                    style={{
                        width: '90%',
                        marginLeft: 'auto',
                        height: '350px',
                    }}
                />
            </div>

            <div className='mt-16 futura-condensed-medium text-[32px] product-card__title'>
                {product.title}
            </div>
        </div>
    );
};

export default BaseProductCard;
