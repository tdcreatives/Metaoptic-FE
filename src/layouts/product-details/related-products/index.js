'use client';

import React from 'react';
import BaseButton from '@/components/BaseButton';
import BaseProduct from '@/components/BaseProduct';

import { useRouter } from 'next/navigation';

const RelatedProducts = ({ relatedProducts }) => {
    const router = useRouter();

    if (!relatedProducts || relatedProducts.length === 0) {
        return null; // Return nothing if there are no related products
    }

    return (
        <div className='mt-12 w-[80%] mx-auto mb-[80px]'>
            <h2 className='xl:text-[72px] text-[32px] text-[#d34c39] uppercase futura-condensed-medium mb-8 text-center'>
                Related Products
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
                {relatedProducts.map((product) => (
                    <BaseProduct
                        key={product.slug}
                        name={product.name}
                        image={product.image}
                        category={product.category}
                        slug={product.slug}
                    />
                ))}
            </div>

            <BaseButton
                label='See all products'
                classNameBtn='uppercase'
                className='!mt-[60px]'
                onClick={() => router.push('/products')}
            />
        </div>
    );
};

export default RelatedProducts;
