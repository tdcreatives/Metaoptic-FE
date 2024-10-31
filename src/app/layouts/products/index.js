import Image from 'next/image';

const Products = () => {
    return (
        <div className='px-[2.6vw] xl:py-[10vh] py-[48px]'>
            <p className='futura-book uppercase text-[#d44c39] text-center tracking-widest xl:text-[4.45vw] text-[24px]'>
                Our products
            </p>

            <div className='grid grid-cols-2 gap-[2.7vw] xl:mt-[10vh] mt-[48px]'>
                <Image
                    src='/product-1.png'
                    alt='Product 1'
                    width='0'
                    height='0'
                    priority
                    unoptimized
                    className='w-full h-auto'
                />
                <Image
                    src='/product-2.png'
                    alt='Product 2'
                    width='0'
                    height='0'
                    priority
                    unoptimized
                    className='w-full h-auto'
                />
                <Image
                    src='/product-3.png'
                    alt='Product 3'
                    width='0'
                    height='0'
                    priority
                    unoptimized
                    className='w-full h-auto'
                />
                <Image
                    src='/product-4.png'
                    alt='Product 4'
                    width='0'
                    height='0'
                    priority
                    unoptimized
                    className='w-full h-auto'
                />
            </div>
        </div>
    );
};

export default Products;
