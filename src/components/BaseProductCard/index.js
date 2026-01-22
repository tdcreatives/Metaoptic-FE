'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

import './index.scss';

const BaseProductCard = ({
    product,
    isHovered,
    isAnyHovered,
    onMouseEnter,
    onMouseLeave,
}) => {
    const router = useRouter();
    const [canHover, setCanHover] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
        const update = () => setCanHover(mq.matches);

        update();
        mq.addEventListener?.('change', update);

        return () => mq.removeEventListener?.('change', update);
    }, []);

    const effectiveHovered = canHover ? isHovered : false;
    const effectiveAnyHovered = canHover ? isAnyHovered : false;

    const renderTextWhenHovering = () => {
        if (effectiveHovered) {
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
        if (effectiveHovered) {
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
                        <motion.button
                            initial={{ x: 200, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 200, opacity: 0 }}
                            transition={{
                                duration: 0.3,
                                ease: [0.37, 0, 0.63, 1],
                                delay: 0.3,
                            }}
                            whileHover={{ scale: 1.05 }}
                            className='bg-black text-white px-4 py-2 rounded-full hover:bg-[#d44c39] xl:text-[20px] futura-condensed-medium border-[2px] border-transparent hover:border-white transition-all whitespace-nowrap'>
                            FIND OUT MORE
                        </motion.button>
                    </div>
                </motion.div>
            );
        }
    };

    const renderImageWhenHovering = () => {
        return (
            <AnimatePresence>
                {effectiveHovered && (
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
        <motion.div
            className={`relative px-4 xl:py-3 py-2 xl:w-full w-[90%] mx-auto product-card ${
                effectiveHovered ? 'product-card--hovered' : ''
            } ${effectiveAnyHovered && !effectiveHovered ? 'product-card--shrink' : ''}`}
            onClick={() => router.push(`/product/${product.slug}`)}
            onMouseEnter={canHover ? onMouseEnter : undefined}
            onMouseLeave={canHover ? onMouseLeave : undefined}
            layout>
            <motion.div
                className={`futura-condensed-medium text-[48px] product-card__id ${
                    effectiveHovered ? 'text-white' : ''
                }`}
                layout>
                {product.id}
            </motion.div>

            {renderTextWhenHovering()}
            {renderLabelWhenHovering()}

            {effectiveAnyHovered || effectiveHovered ? (
                <></>
            ) : (
                <div className={`${effectiveHovered ? 'mt-0' : 'mt-5'} z-10 relative flex`}>
                    <Image
                        width={0}
                        height={0}
                        sizes='(max-width: 768px) 100vw, 50vw'
                        src={`/${product?.image || 'fallback-image.svg'}`}
                        alt='Product'
                        style={{
                            width: effectiveHovered ? 'fit-content' : '90%',
                            marginLeft: 'auto',
                            height: effectiveHovered ? '300px' : '200px',
                            objectFit: effectiveHovered ? 'contain' : 'cover',
                            objectPosition: product?.objectPosition || 'center',
                            marginRight: effectiveHovered ? 'auto' : '0',
                        }}
                    />
                </div>
            )}

            {renderImageWhenHovering()}

            {!effectiveAnyHovered && (
                <motion.div
                    className='mt-8 w-full max-w-[300px] mx-auto text-start'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                        duration: 0.5,
                        ease: 'easeInOut',
                        delay: effectiveHovered ? 0 : 0.5,
                    }}
                    layout>
                    <motion.div
                        className={`futura-condensed-medium xl:text-[24px] text-[18px] product-card__title ${
                            effectiveHovered ? 'text-white' : ''
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

            {effectiveAnyHovered && !effectiveHovered && (
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
    );
};

export default BaseProductCard;