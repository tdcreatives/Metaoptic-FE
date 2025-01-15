'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';

const MobileProductCard = ({ product }) => {
    const router = useRouter();
    const [isTouched, setIsTouched] = useState(false);
    const [touchCount, setTouchCount] = useState(0);
    const [lastTouchTime, setLastTouchTime] = useState(0);

    const handleTouch = () => {
        const currentTime = new Date().getTime();
        const timeDiff = currentTime - lastTouchTime;

        if (timeDiff < 300) {
            // Double tap detected (within 300ms)
            handleOnNavigate();
            setTouchCount(0);
            setLastTouchTime(0);
        } else {
            setTouchCount(1);
            setLastTouchTime(currentTime);
            setIsTouched(true);
        }
    };

    const handleTouchEnd = () => {
        if (touchCount === 1) {
            setIsTouched(false);
        }
    };

    const handleOnNavigate = () => {
        router.push(`/product/${product.slug}`);
    };

    return (
        <div
            className={`bg-[#ebebeb] px-4 py-5 relative h-[250px] overflow-hidden ${
                isTouched ? '!bg-[#d34c39]' : ''
            }`}
            onTouchStart={handleTouch}
            onTouchEnd={handleTouchEnd}>
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
