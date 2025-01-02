'use client';

import React from 'react';
import Image from 'next/image';
import './index.scss';

const BaseProductCard = ({
    product,
    isHovered,
    isAnyHovered,
    onMouseEnter,
    onMouseLeave,
}) => {
    return (
        <div
            className={`relative px-4 py-[32px] xl:w-full w-[90%] mx-auto product-card ${
                isHovered ? 'product-card--hovered' : ''
            } ${isAnyHovered && !isHovered ? 'product-card--shrink' : ''}`}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}>
            <div
                className={`futura-condensed-medium text-[90px] product-card__id ${
                    isHovered ? 'text-white' : ''
                }`}>
                {product.id}
            </div>

            {/* Product Image */}
            {!isAnyHovered || isHovered ? (
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
                            height: '300px',
                            objectFit: 'cover',
                            objectPosition: product?.objectPosition,
                        }}
                    />
                </div>
            ) : null}

            {!isAnyHovered && (
                <div
                    className={`mt-16 futura-condensed-medium text-[32px] product-card__title ${
                        isHovered ? 'text-white' : ''
                    }`}>
                    {product.title}
                </div>
            )}

            {isAnyHovered && !isHovered && (
                <div
                    className={`futura-condensed-medium text-[40px] rotate-[-90deg] text-[#808285]`}
                    style={{
                        whiteSpace: 'pre',
                        marginTop: '100%',
                    }}>
                    {product.title}
                </div>
            )}
        </div>
    );
};

export default BaseProductCard;
