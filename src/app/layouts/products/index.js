import Image from 'next/image';

const Products = () => {
    return (
        <div
            className='px-[2.6vw] py-[18.5vh]'
            style={{
                paddingTop: '18.5vh',
                paddingBottom: '18.5vh',
                paddingLeft: '2.6vw',
                paddingRight: '2.6vw',
            }}>
            <p
                className='furuta-book uppercase text-[#C65741] text-center tracking-widest'
                style={{
                    fontSize: '4.45vw',
                }}>
                Our products
            </p>

            <div
                className='grid grid-cols-2 gap-[2.7vw]'
                style={{
                    marginTop: '18.5vh',
                }}>
                <Image
                    src='/product-1.png'
                    alt='Product 1'
                    width='0'
                    height='0'
                    priority
                    sizes='100vw'
                    className='w-full h-auto'
                />
                <Image
                    src='/product-2.png'
                    alt='Product 2'
                    width='0'
                    height='0'
                    priority
                    sizes='100vw'
                    className='w-full h-auto'
                />
                <Image
                    src='/product-3.png'
                    alt='Product 3'
                    width='0'
                    height='0'
                    priority
                    sizes='100vw'
                    className='w-full h-auto'
                />
                <Image
                    src='/product-4.png'
                    alt='Product 4'
                    width='0'
                    height='0'
                    priority
                    sizes='100vw'
                    className='w-full h-auto'
                />
            </div>
        </div>
    );
};

export default Products;
