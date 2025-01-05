'use client';

import React, { useState, useEffect } from 'react';
import { gsap } from 'gsap';

const categories = ['All', 'Camera', 'Projector', 'Sensor', '3D'];

const ProductTabs = () => {
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
                                : 'bg-transparent text-black hover:bg-[#d34c39] hover:text-white border-[#000] hover:border-[#d34c39]' // Inactive: white background, black text
                        } border-[#d34c39]`}>
                        {category}
                    </button>
                ))}
            </div>

            {/* Placeholder for tab content */}
            <div className='w-full max-w-5xl mt-8 p-6 border border-gray-200 rounded-xl bg-white shadow-lg text-center'>
                <p className='text-xl text-gray-600'>
                    Showing: <span className='font-semibold'>{selectedTab}</span>
                </p>
            </div>
        </div>
    );
};

export default ProductTabs;
