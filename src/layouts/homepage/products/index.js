'use client';

import React, { useState } from 'react';
import BaseProductCard from '@/components/BaseProductCard';

import { useRouter } from 'next/navigation';

import BaseButton from '@/components/BaseButton';

const products = [
    {
        id: '01',
        title: 'IoT Metalens Color Camera',
        description:
            'Leading edge mass producible meta lens using 12&quot; Glass Wafer DUV Immersion Photolithography Manufacturing Process . Designed for color imaging or non-contact fingerprint sensing.',
        image: 'landing-product-1.png',
        objectPosition: 'left',
        slug: 'iot-metalens-color-camera',
    },
    {
        id: '02',
        title: 'Color Imaging Metalens',
        description:
            'Leading edge mass producible meta lens using 12&quot; Glass Wafer DUV Immersion Photolithography Manufacturing Process . Designed for color imaging or non-contact fingerprint sensing.',
        image: 'landing-product-2.png',
        objectPosition: 'left',
        slug: 'color-imaging-meta-lens',
    },
    {
        id: '03',
        title: 'Ultra-light weight Pico Projector',
        description:
            'Leading edge mass producible meta lens using 12&quot; Glass Wafer DUV Immersion Photolithography Manufacturing Process . Designed for color imaging or non-contact fingerprint sensing.',
        image: 'landing-product-3.png',
        objectPosition: 'left',
        slug: 'pico-projector',
    },
    {
        id: '04',
        title: 'Collimating Metalens For Pico Projector',
        description:
            'Leading edge mass producible meta lens using 12&quot; Glass Wafer DUV Immersion Photolithography Manufacturing Process . Designed for color imaging or non-contact fingerprint sensing.',
        image: 'landing-product-4.png',
        objectPosition: 'left',
        slug: 'collimating-meta-lens-pico-projector',
    },
    {
        id: '05',
        title: '3D Biometrics Metalens Sensor',
        description:
            'Leading edge mass producible meta lens using 12&quot; Glass Wafer DUV Immersion Photolithography Manufacturing Process . Designed for color imaging or non-contact fingerprint sensing.',
        image: 'landing-product-5.png',
        objectPosition: 'center',
        slug: '3d-biometrics-metalens-sensor',
    },
];

const Products = () => {
    const router = useRouter();
    const [hoveredIndex, setHoveredIndex] = useState(null);

    const handleMouseEnter = (index) => {
        setHoveredIndex(index);
    };

    const handleMouseLeave = () => {
        setHoveredIndex(null);
    };

    return (
        <div className='xl:pt-[10vh] pt-[100px]'>
            <h2 className='xl:text-[150px] text-[64px] text-[#d34c39] uppercase futura-condensed-medium text-center'>
                OUR PRODUCTS
            </h2>

            <div className='flex xl:flex-row flex-col mt-16'>
                {products.map((product, index) => (
                    <BaseProductCard
                        key={product.id}
                        product={product}
                        isHovered={hoveredIndex === index}
                        isAnyHovered={hoveredIndex !== null}
                        onMouseEnter={() => handleMouseEnter(index)}
                        onMouseLeave={handleMouseLeave}
                    />
                ))}
            </div>

            <BaseButton
                label='See all products'
                classNameBtn='uppercase'
                onClick={() => router.push('/products')}
            />
        </div>
    );
};

export default Products;
