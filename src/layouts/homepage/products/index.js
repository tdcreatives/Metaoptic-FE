'use client';

import React, { useState } from 'react';
import BaseProductCard from '@/components/BaseProductCard';
import MobileProductCard from '@/components/BaseProductCard/MobileProductCard';
import BaseTitle from '@/components/BaseTitle';

import { useRouter } from 'next/navigation';

import BaseButton from '@/components/BaseButton';
import { isMobile } from 'react-device-detect';

const products = [
    {
        id: '01',
        title: 'IoT Metalens Color Camera',
        category: 'Metalens IoT Product',
        description:
            'Leading edge camera to capture a color image using meta lens. 12" Glass Wafer DUV Immersion Photolithography Manufacturing Process. Customized for color imaging or non-contact fingerprint sensing. Inclusive of advanced software with AI image enhancement functions. Camera assembly process is tunable to fit applications.',
        image: 'landing-product-1.png',
        objectPosition: 'left',
        slug: 'iot-metalens-color-camera',
    },
    {
        id: '02',
        title: 'Color Imaging Metalens',
        category: 'Camera',
        description:
            'Leading edge mass producible meta lens using 12" Glass Wafer DUV Immersion Photolithography Manufacturing Process. Designed for color imaging or non-contact fingerprint sensing.',
        image: 'landing-product-2.png',
        objectPosition: 'left',
        slug: 'color-imaging-meta-lens',
    },
    {
        id: '03',
        title: 'Ultra-Light Weight Pico Projector',
        category: 'Projector',
        description:
            'Auto focus pico projector with low power consumption. Ultra light weight — 80g. Seamless user experience & noiseless.',
        image: 'landing-product-3.png',
        objectPosition: 'left',
        slug: 'pico-projector',
    },
    {
        id: '04',
        title: 'Collimating Metalens For Pico Projector',
        category: 'Projector',
        description:
            'Leading edge mass producible collimating meta lens for pico projector working in visible light wavelengths (Color).',
        image: 'landing-product-4.png',
        objectPosition: 'left',
        slug: 'collimating-meta-lens-pico-projector',
    },
    {
        id: '05',
        title: '3D Biometrics Metalens Sensor',
        category: 'Sensor',
        description:
            'Inclusive Of Advanced Software With AI Image Enhancement Algorithm. Camera Assembly Process Is Tunable To Fit Applications.',
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
        <div className='xl:pt-[120px] pt-[100px]'>
            <BaseTitle
                title='OUR PRODUCTS'
                className='futura-condensed-medium xl:ml-8 ml-0 !text-center'
            />

            <div className='flex xl:flex-row flex-col xl:mt-8 mt-4 xl:gap-0 gap-3'>
                {products.map((product, index) => {
                    if (isMobile) {
                        return <MobileProductCard product={product} key={product.id} />;
                    }

                    return (
                        <BaseProductCard
                            key={product.id}
                            product={product}
                            isHovered={hoveredIndex === index}
                            isAnyHovered={hoveredIndex !== null}
                            onMouseEnter={() => handleMouseEnter(index)}
                            onMouseLeave={handleMouseLeave}
                        />
                    );
                })}
            </div>

            <BaseButton
                label='See all products'
                classNameBtn='uppercase'
                className='mb-0'
                onClick={() => router.push('/products')}
            />
        </div>
    );
};

export default Products;
