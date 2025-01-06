'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import './index.scss';

const BaseProductCard = ({
    product,
    isHovered,
    isAnyHovered,
    onMouseEnter,
    onMouseLeave,
}) => {
    const router = useRouter();

    const renderTextWhenHovering = () => {
        if (isHovered) {
            // Split title into two parts if it contains a space
            const titleParts = product.title.split(' ');
            const firstHalf = titleParts
                .slice(0, Math.ceil(titleParts.length / 2))
                .join(' ');
            const secondHalf = titleParts
                .slice(Math.ceil(titleParts.length / 2))
                .join(' ');

            return (
                <>
                    <div className='text-[200px] text-white futura-condensed-medium absolute top-[120px] left-[-20px] z-1 w-[300%]'>
                        <div
                            style={{
                                lineHeight: '1',
                            }}>
                            {firstHalf.toUpperCase()}
                        </div>

                        <div className='mt-[-60px]'>{secondHalf.toUpperCase()}</div>
                    </div>

                    <div className='absolute top-[120px] left-[50%] transform translate-x-[-50%] z-10'>
                        <Image
                            width={0}
                            height={0}
                            sizes='100vh'
                            src={`/${product?.image}`}
                            alt='Product'
                            style={{
                                width: 'fit-content',
                                marginLeft: 'auto',
                                height: '500px',
                                objectFit: isHovered ? 'contain' : 'cover',
                                objectPosition: product?.objectPosition,
                                marginRight: isHovered ? 'auto' : '0',
                            }}
                        />
                    </div>
                </>
            );
        }
    };

    const renderLabelWhenHovering = () => {
        if (isHovered) {
            return (
                <>
                    {/* Green Chip */}
                    <div className='bg-transparent text-white px-4 py-1 text-[14px] rounded-full font-semibold mb-2 mt-[340px] text-[24px] w-fit border-[2px] border-white'>
                        {product.category}
                    </div>

                    {/* Title */}
                    <h2 className='text-white text-[70px] futura-condensed-medium mt-[-12px]'>
                        {product.title}
                    </h2>

                    {/* Description */}
                    <p className='text-[#ffffffcc] text-[20px] mt-[-20px] w-[70%]'>
                        {product.description}
                    </p>

                    {/* Button */}
                    <div className='mt-2 ml-auto flex justify-end'>
                        <button className='bg-black text-white px-6 py-3 rounded-full hover:bg-[#d44c39] transition-all text-[26px] futura-condensed-medium hover:border-[2px] hover:border-white border-[2px] border-[transparent] mt-[-60px]'>
                            FIND OUT MORE
                        </button>
                    </div>
                </>
            );
        }
    };

    return (
        <div
            className={`relative px-4 py-[32px] xl:w-full w-[90%] mx-auto product-card ${
                isHovered ? 'product-card--hovered' : ''
            } ${isAnyHovered && !isHovered ? 'product-card--shrink' : ''}`}
            onClick={() => router.push(`/product/${product.slug}`)}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}>
            <div
                className={`futura-condensed-medium text-[90px] product-card__id ${
                    isHovered ? 'text-white' : ''
                }`}>
                {product.id}
            </div>

            {renderTextWhenHovering()}

            {renderLabelWhenHovering()}
            {/* Product Image */}

            {isAnyHovered || isHovered ? (
                <></>
            ) : (
                <div className={`${isHovered ? 'mt-0' : 'mt-10'} z-10 relative flex`}>
                    <Image
                        width={0}
                        height={0}
                        sizes='100vh'
                        src={`/${product?.image}`}
                        alt='Product'
                        style={{
                            width: isHovered ? 'fit-content' : '90%',
                            marginLeft: 'auto',
                            height: isHovered ? '400px' : '300px',
                            objectFit: isHovered ? 'contain' : 'cover',
                            objectPosition: product?.objectPosition,
                            marginRight: isHovered ? 'auto' : '0',
                        }}
                    />
                </div>
            )}

            {!isAnyHovered && (
                <>
                    <div
                        className={`mt-16 futura-condensed-medium text-[32px] product-card__title ${
                            isHovered ? 'text-white' : ''
                        }`}>
                        {product.title}
                    </div>

                    <Image
                        width='0'
                        height='0'
                        sizes='100vw'
                        src='/next-orange.svg'
                        alt='Next'
                        className='w-[50px]'
                    />
                </>
            )}

            {isAnyHovered && !isHovered && (
                <div>
                    <div
                        className={`futura-condensed-medium text-[40px] rotate-[-90deg] text-[#808285]`}
                        style={{
                            whiteSpace: 'pre',
                            marginTop: '100%',
                        }}>
                        {product.title}
                    </div>

                    <Image
                        width='0'
                        height='0'
                        sizes='100vw'
                        src='/next-orange.svg'
                        alt='Next'
                        className='w-[50px]'
                    />
                </div>
            )}
        </div>
    );
};

export default BaseProductCard;
