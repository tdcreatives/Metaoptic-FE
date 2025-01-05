'use client';

import React from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image';
import { gsap } from 'gsap';

const BaseProduct = ({ name, image }) => {
    const productRef = React.useRef(null);
    const nameRef = React.useRef(null);

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

    return (
        <div>
            <div
                ref={productRef}
                className='rounded-lg p-6 shadow-lg flex flex-col items-center justify-center cursor-pointer transition-transform duration-300'
                style={{ backgroundColor: '#F0F0F0' }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}>
                <div className='relative w-[95%] mx-auto h-[300px]'>
                    <Image
                        width='0'
                        height='0'
                        sizes='100vw'
                        src={image}
                        alt={name}
                        className='w-full h-full object-contain'
                    />
                </div>
            </div>

            <h2
                ref={nameRef}
                className='text-[#231f20] xl:text-[32px] text-[24px] futura-condensed-medium mt-3'>
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
