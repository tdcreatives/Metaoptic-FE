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
        <div className='xl:pt-[10vh] pt-[100px]'>
            <h2 className='xl:text-[150px] text-[64px] text-[#d34c39] uppercase futura-condensed-medium text-center'>
                OUR PRODUCTS
            </h2>

            <div className='grid grid-cols-5 mt-16'>
                {products.map((product) => (
                    <BaseProductCard key={product.id} product={product} />
                ))}
            </div>

            <div className='flex xl:justify-start justify-center xl:mt-10 mt-6 xl:ml-10 ml-0'>
                <button className='bg-[#d34c39] text-white font-bold px-10 py-3 rounded-full futura-medium xl:tracking-[4px] tracking-[2px] xl:text-[20px] text-[16px]'>
                    SEE ALL PRODUCTS
                </button>
            </div>
        </div>
    );
};

export default Products;
