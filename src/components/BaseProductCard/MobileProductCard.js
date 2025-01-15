'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';

const MobileProductCard = ({ product, onTouch = () => {}, productIdIsTouched }) => {
    const [isTouched, setIsTouched] = useState(false);
    const [lastTouchTime, setLastTouchTime] = useState(0);
    const router = useRouter();

    const handleTouch = () => {
        const currentTime = new Date().getTime();
        const timeDiff = currentTime - lastTouchTime;

        if (timeDiff < 300) {
            // Double touch detected (within 300ms)
            handleNavigate();
        } else {
            onTouch(product?.id);
        }
        setLastTouchTime(currentTime);
    };

    const handleNavigate = () => {
        router.push(`/product/${product?.slug}`);
    };

    useEffect(() => {
        if (productIdIsTouched && productIdIsTouched === product?.id) {
            setIsTouched(true);
        } else {
            setIsTouched(false);
        }
    }, [product?.id, productIdIsTouched]);

    return (
        <div
            className={`bg-[#ebebeb] px-4 py-5 relative h-[250px] overflow-hidden ${
                isTouched ? '!bg-[#d34c39]' : ''
            }`}
            onTouchStart={handleTouch}>
            <div className='flex flex-col justify-between h-full'>
                <motion.div
                    className={`futura-condensed-medium text-[28px] ${
                        isTouched ? '!text-white' : 'text-[#d34c39]'
                    }`}
                    layout>
                    {product.id}
                </motion.div>

                <div>
                    <div
                        className={`futura-condensed-medium text-[24px] max-w-[40%] ${
                            isTouched ? '!text-white' : ''
                        }`}>
                        {product?.title}
                    </div>

                    {isTouched ? (
                        <Image
                            width='0'
                            height='0'
                            src='/next-orange-white.svg'
                            alt='Next'
                            className='w-[28px]'
                        />
                    ) : (
                        <Image
                            width='0'
                            height='0'
                            src='/next-orange.svg'
                            alt='Next'
                            className='w-[28px]'
                        />
                    )}
                </div>
            </div>

            <Image
                src={`/${product?.image || 'fallback-image.svg'}`}
                alt='Product'
                width='0'
                height={0}
                className={`rounded-lg h-[200px] left-[60%] w-auto object-contain absolute top-1/2 -translate-y-1/2 ${
                    product?.objectPosition
                        ? `object-${product.objectPosition}`
                        : 'object-center'
                }`}
                sizes='100vw'
            />
        </div>
    );
};

export default MobileProductCard;
