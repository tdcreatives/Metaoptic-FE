import Image from 'next/image';

const Header = () => {
    return (
        <div
            className='font-bold flex justify-between max-w-[1920px] mx-auto'
            style={{
                padding: '4.44vh 4.5vw',
            }}>
            <Image
                src='/logo.svg'
                alt='Logo'
                width='0'
                height='0'
                className='w-[19.5vw] h-auto cursor-pointer' // 375px converted to 19.5vw
                priority
            />

            <Image
                src='/menu.svg'
                alt='Menu'
                width='0'
                height='0'
                className='w-[5vw] h-auto cursor-pointer' // 96px converted to 5vw
                priority
            />
        </div>
    );
};

export default Header;
