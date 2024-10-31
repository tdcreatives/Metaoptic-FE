'use client';

import { useRouter } from 'next/navigation';

import Image from 'next/image';

const Header = () => {
    const router = useRouter();
    return (
        <div className='font-bold flex justify-between max-w-[1920px] mx-auto px-[4.5vw] py-[4.44vh]'>
            <Image
                src='/logo.svg'
                alt='Logo'
                width='0'
                height='0'
                className='xl:w-[9vw] w-[84px] h-auto cursor-pointer'
                priority
                onClick={() => router.push('/')}
            />

            <Image
                src='/menu.svg'
                alt='Menu'
                width='0'
                height='0'
                className='xl:w-[4vw] w-[32px] h-auto cursor-pointer'
                priority
            />
        </div>
    );
};

export default Header;
