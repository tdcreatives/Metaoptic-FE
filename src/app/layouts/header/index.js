import Image from 'next/image';

const Header = () => {
    return (
        <div
            className='font-bold flex justify-between max-w-[1920px] mx-auto'
            style={{
                padding: '4.44vh 4.5vw', // 48px vertical padding and 4.5vw horizontal padding
            }}>
            <Image
                src='/logo.svg'
                alt='Logo'
                width='0'
                height='0'
                className='w-[9vw] h-auto cursor-pointer'
                priority
            />

            <Image
                src='/menu.svg'
                alt='Menu'
                width='0'
                height='0'
                className='w-[4vw] h-auto cursor-pointer'
                priority
            />
        </div>
    );
};

export default Header;
