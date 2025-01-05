'use client';

import React from 'react';

import { useParams } from 'next/navigation';
import data from '@/constants/data.json';

import Header from '@/layouts/main/header';
import Footer from '@/layouts/main/footer';

import ProductDetailsBanner from '@/layouts/product-details/banner';

const ProductDetails = () => {
    const { slug } = useParams();

    const product = data.products.find((item) => item.slug === slug);

    if (!product) {
        return (
            <div className='flex flex-col items-center justify-center min-h-screen'>
                <h1 className='text-4xl font-semibold text-red-500'>Product Not Found</h1>
                <button
                    onClick={() => router.push('/')}
                    className='mt-4 bg-[#d34c39] text-white px-4 py-2 rounded-lg'>
                    Go Back to Home
                </button>
            </div>
        );
    }

    return (
        <>
            <Header background='#f0f0f0' />

            <ProductDetailsBanner product={product} />

            <Footer />
        </>
    );
};

export default ProductDetails;
