'use client';

import React from 'react';
import BaseButton from '@/components/BaseButton';
import BaseProduct from '@/components/BaseProduct';
import BaseTitle from '@/components/BaseTitle';

import Link from 'next/link';

const RelatedProducts = ({ relatedProducts }) => {

    if (!relatedProducts || relatedProducts.length === 0) {
        return null; // Return nothing if there are no related products
    }

    return (
        <div className='xl:mt-8 mt-4 w-[80%] mx-auto mb-[40px]'>
            <BaseTitle
                title='Related Products'
                className='!text-center futura-condensed-medium'
            />

            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 xl:mt-8 mt-4'>
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

            <Link href="/products">
                <BaseButton
                    label='See all products'
                    classNameBtn='uppercase'
                    className='!mt-[60px]'
                />
            </Link>
        </div>
    );
};

export default RelatedProducts;
