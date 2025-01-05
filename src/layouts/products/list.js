'use client';

import React, { useState, useEffect } from 'react';
import BaseProduct from '@/components/BaseProduct';
import { gsap } from 'gsap';
import data from './data.json';

const categories = ['All', 'Camera', 'Projector', 'Sensor', '3D'];

const ProductList = () => {
    const [selectedTab, setSelectedTab] = useState('All');

    useEffect(() => {
        const activeTab = document.querySelector('.tab-active');
        if (activeTab) {
            gsap.fromTo(
                activeTab,
                { y: 100, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.3, ease: 'power3.out' }
            );
        }
    }, [selectedTab]);

    // Filter products based on selected category
    const filteredProducts =
        selectedTab === 'All'
            ? data.products
            : data.products.filter((product) => product.category === selectedTab);

    return (
        <div className='flex flex-col items-center gap-8'>
            {/* Title */}
            <h2 className='xl:text-[150px] text-[64px] text-[#d34c39] uppercase futura-condensed-medium xl:ml-16 ml-0'>
                Our Products
            </h2>

            {/* Tabs */}
            <div className='flex gap-4 flex-wrap justify-center'>
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => setSelectedTab(category)}
                        className={`px-6 py-3 border-2 rounded-full uppercase tracking-wider font-medium transition-all duration-300 ${
                            selectedTab === category
                                ? 'bg-[#d34c39] text-white tab-active' // Active: background orange-red, white text
                                : 'bg-transparent text-black hover:bg-[#d34c39] hover:text-white border-[#000] hover:border-[#d34c39]'
                        } border-[#d34c39]`}>
                        {category}
                    </button>
                ))}
            </div>

            {/* Products Grid */}
            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full max-w-6xl mt-8 mb-[100px]'>
                {filteredProducts.map((product) => (
                    <BaseProduct
                        key={product.slug}
                        name={product.name}
                        image={product.image}
                        category={product.category}
                    />
                ))}
            </div>
        </div>
    );
};

export default ProductList;
