'use client';

import React from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';

const BaseProduct = ({ name, image, slug }) => {
    const productRef = React.useRef(null);
    const nameRef = React.useRef(null);
    const router = useRouter();

    const handleMouseEnter = () => {
        if (productRef.current && nameRef.current) {
            gsap.to(productRef.current, {
                backgroundColor: '#d34c39',
                scale: 1.05,
                duration: 0.4,
                ease: 'power3.out',
            });
            gsap.to(nameRef.current, {
                color: '#d34c39',
                duration: 0.4,
                ease: 'power3.out',
            });
        }
    };

    const handleMouseLeave = () => {
        if (productRef.current && nameRef.current) {
            gsap.to(productRef.current, {
                backgroundColor: '#F0F0F0',
                scale: 1,
                duration: 0.4,
                ease: 'power3.out',
            });
            gsap.to(nameRef.current, {
                color: '#231f20',
                duration: 0.4,
                ease: 'power3.out',
            });
        }
    };

    const handleOnNavigate = () => {
        router.push(`/product/${slug}`);
    };

    return (
        <div onClick={handleOnNavigate}>
            <div
                ref={productRef}
                className='rounded-lg p-4 shadow-lg flex flex-col items-center justify-center cursor-pointer transition-transform duration-300 overflow-hidden'
                style={{ backgroundColor: '#F0F0F0' }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}>
                <div className='relative w-full aspect-square'>
                    <Image
                        fill
                        src={image}
                        alt={name}
                        className='object-contain'
                        sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                    />
                </div>
            </div>

            <h2
                ref={nameRef}
                className='text-[#231f20] xl:text-[24px] text-[18px] text-center futura-condensed-medium mt-3'>
                {name}
            </h2>
        </div>
    );
};

BaseProduct.propTypes = {
    name: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
};

export default BaseProduct;
