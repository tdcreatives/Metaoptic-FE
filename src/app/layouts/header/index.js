import Image from 'next/image';

const Header = () => {
    return (
        <div className='font-bold px-[4.5vw] py-[48px] flex justify-between max-w-[1920px] mx-auto'>
            <Image
                src='/logo.svg'
                alt='Logo'
                width='0'
                height='0'
                sizes='19.5vw'
                className='w-[19.5vw] h-auto cursor-pointer'
                priority
            />

            <Image
                src='/menu.svg'
                alt='Logo'
                width='0'
                height='0'
                sizes='100vw'
                className='w-[5vw] h-auto cursor-pointer'
                priority
            />
        </div>
    );
};

export default Header;
