import Image from 'next/image';
import BaseProductCard from '@/app/components/BaseProductCard';

const products = [
    {
        id: '01',
        title: 'IoT Metalens Color Camera',
        image: 'landing-product-1.png',
    },
    {
        id: '02',
        title: 'Colour Imaging Metalens',
        image: 'landing-product-2.png',
    },
    {
        id: '03',
        title: 'Ultra-light weight Pico Projector',
        image: 'landing-product-3.png',
    },
    {
        id: '04',
        title: 'Collimating Metalens For Pico Projector',
        image: 'landing-product-4.png',
    },
    {
        id: '05',
        title: '3D Biometrics Metalens Sensor',
        image: 'landing-product-4.png',
    },
];

const Products = () => {
    return (
        <div className='xl:pt-[10vh] pt-[48px]'>
            <h2 className='text-[150px] text-[#d34c39] uppercase futura-condensed-medium ml-16 text-center'>
                OUR PRODUCTS
            </h2>

            <div className='grid grid-cols-5 mt-16'>
                {products.map((product) => (
                    <BaseProductCard key={product.id} product={product} />
                ))}
            </div>

            <div className='flex justify-center mt-10'>
                <button className='bg-[#d34c39] text-white font-bold text-lg px-10 py-3 rounded-full futura-medium tracking-[4px] mt-6 text-[20px]'>
                    SEE ALL PRODUCTS
                </button>
            </div>
        </div>
    );
};

export default Products;
