'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

import './index.scss';

const BaseProductCard = ({
    product,
    isHovered,
    isAnyHovered,
    onMouseEnter,
    onMouseLeave,
}) => {

    const renderTextWhenHovering = () => {
        if (isHovered) {
            const titleParts = product.title.split(' ');
            const firstHalf = titleParts
                .slice(0, Math.ceil(titleParts.length / 2))
                .join(' ');
            const secondHalf = titleParts
                .slice(Math.ceil(titleParts.length / 2))
                .join(' ');

            return (
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className='text-[200px] text-white futura-condensed-medium absolute top-[120px] left-[-20px] z-1 w-[300%]'>
                    {/* <div style={{ lineHeight: '1' }}>{firstHalf.toUpperCase()}</div>
                    <div className='mt-[-60px]'>{secondHalf.toUpperCase()}</div> */}
                </motion.div>
            );
        }
    };

    const renderLabelWhenHovering = () => {
        if (isHovered) {
            return (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}>
                    <div className='bg-transparent text-white px-4 py-1 rounded-full font-semibold mb-2 mt-[200px] xl:text-[16px] text-[16px] w-fit border-[2px] border-white'>
                        {product.category}
                    </div>
                    <h2 className='text-white xl:text-[48px] text-[32px] futura-condensed-medium w-[1000px]'>
                        {product.title}
                    </h2>
                    <p className='text-[#ffffffcc] xl:text-[18px] w-[700px] overflow-hidden'>
                        {product.description}
                    </p>
                    <div className='absolute bottom-5 right-2 w-[140px]'>
                        <Link href={`/product/${product.slug}`}>
                            <motion.div
                                initial={{ x: 200, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: 200, opacity: 0 }}
                                transition={{
                                    duration: 0.3,
                                    ease: [0.37, 0, 0.63, 1],
                                    delay: 0.3,
                                }}
                                whileHover={{ scale: 1.05 }}
                                className='bg-black text-white px-4 py-2 rounded-full hover:bg-[#d44c39] xl:text-[20px] futura-condensed-medium border-[2px] border-transparent hover:border-white transition-all whitespace-nowrap cursor-pointer text-center'>
                                FIND OUT MORE
                            </motion.div>
                        </Link>
                    </div>
                </motion.div>
            );
        }
    };

    const renderImageWhenHovering = () => {
        return (
            <AnimatePresence>
                {isHovered && (
                    <motion.div
                        className='absolute inset-0 z-10 flex justify-center items-center top-[-150px]'
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.3 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}>
                        <Image
                            src={`/${product?.image || 'fallback-image.svg'}`}
                            alt='Product'
                            width='0'
                            height={0}
                            className='rounded-lg h-[300px] w-auto'
                            sizes='100vw'
                            style={{
                                objectFit: 'contain',
                                objectPosition: 'center',
                                maxWidth: '100%',
                                maxHeight: '100%',
                            }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        );
    };

    return (
        <Link href={`/product/${product.slug}`} className="block">
            <motion.div
                className={`relative px-4 xl:py-3 py-2 xl:w-full w-[90%] mx-auto product-card ${
                    isHovered ? 'product-card--hovered' : ''
                } ${isAnyHovered && !isHovered ? 'product-card--shrink' : ''}`}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                layout>
            <motion.div
                className={`futura-condensed-medium text-[48px] product-card__id ${
                    isHovered ? 'text-white' : ''
                }`}
                layout>
                {product.id}
            </motion.div>

            {renderTextWhenHovering()}
            {renderLabelWhenHovering()}

            {isAnyHovered || isHovered ? (
                <></>
            ) : (
                <div className={`${isHovered ? 'mt-0' : 'mt-5'} z-10 relative flex`}>
                    <Image
                        width={0}
                        height={0}
                        sizes='(max-width: 768px) 100vw, 50vw'
                        src={`/${product?.image || 'fallback-image.svg'}`}
                        alt='Product'
                        style={{
                            width: isHovered ? 'fit-content' : '90%',
                            marginLeft: 'auto',
                            height: isHovered ? '300px' : '200px',
                            objectFit: isHovered ? 'contain' : 'cover',
                            objectPosition: product?.objectPosition || 'center',
                            marginRight: isHovered ? 'auto' : '0',
                        }}
                    />
                </div>
            )}

            {renderImageWhenHovering()}

            {!isAnyHovered && (
                <motion.div
                    className='mt-8 w-full max-w-[300px] mx-auto text-start'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                        duration: 0.5,
                        ease: 'easeInOut',
                        delay: isHovered ? 0 : 0.5,
                    }}
                    layout>
                    <motion.div
                        className={`futura-condensed-medium xl:text-[24px] text-[18px] product-card__title ${
                            isHovered ? 'text-white' : ''
                        }`}
                        layout
                        style={{
                            whiteSpace: 'normal',
                            wordWrap: 'break-word',
                            lineHeight: '1.4',
                            transition: 'opacity 0.3s ease-in-out',
                        }}>
                        {product.title}
                    </motion.div>

                    <motion.div
                        className='mt-4 flex justify-start'
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{
                            duration: 0.3,
                            ease: 'easeInOut',
                            delay: 0.1,
                        }}>
                        <Image
                            width='0'
                            height='0'
                            src='/next-orange.svg'
                            alt='Next'
                            className='w-[40px]'
                        />
                    </motion.div>
                </motion.div>
            )}

            {isAnyHovered && !isHovered && (
                <motion.div
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                    className='flex flex-col gap-2'>
                    <div
                        className='futura-condensed-medium xl:text-[28px] text-[20px] text-[#808285]'
                        style={{
                            whiteSpace: 'normal',
                            wordWrap: 'break-word',
                            writingMode: 'vertical-rl',
                            transform: 'rotate(180deg)',
                            marginLeft: '-2px',
                        }}>
                        {product.title}
                    </div>
                    <Image
                        width='0'
                        height='0'
                        src='/next-orange.svg'
                        alt='Next'
                        className='w-[36px]'
                    />
                </motion.div>
            )}
            </motion.div>
        </Link>
    );
};

export default BaseProductCard;
