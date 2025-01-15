import { motion } from 'framer-motion';

import Image from 'next/image';

const MobileProductCard = ({ product }) => {
    return (
        <div className='bg-[#ebebeb] px-4 py-5 relative h-[250px] overflow-hidden'>
            <div className='flex flex-col justify-between h-full'>
                <motion.div
                    className={`futura-condensed-medium text-[28px] product-card__id`}
                    layout>
                    {product.id}
                </motion.div>

                <div>
                    <div className='futura-condensed-medium text-[24px] max-w-[40%]'>
                        {product?.title}
                    </div>

                    <Image
                        width='0'
                        height='0'
                        src='/next-orange.svg'
                        alt='Next'
                        className='w-[28px]'
                    />
                </div>
            </div>

            <Image
                src={`/${product?.image || 'fallback-image.svg'}`}
                alt='Product'
                width='0'
                height={0}
                className='rounded-lg h-[200px] w-auto'
                sizes='100vw'
                style={{
                    objectFit: 'contain',
                    objectPosition: product?.objectPosition || 'center',
                    position: 'absolute',
                    right: '0%',
                    top: '50%',
                    transform: 'translateY(-50%)',
                }}
            />
        </div>
    );
};

export default MobileProductCard;
