import Image from 'next/image';

const Banner = () => {
    return (
        <div className='max-w-[78vw] mx-auto relative my-[11vh] flex items-center justify-center h-[134vh]'>
            <Image
                src='/background-banner.svg'
                alt='Logo'
                width='0'
                height='0'
                className='w-full h-auto cursor-pointer absolute top-0 left-0'
                priority
            />

            {/* Content */}
            <div className='relative z-10 flex flex-col pt-[8vh]'>
                <p
                    className='font-medium text-[#C65741] tracking-widest uppercase text-center futura-book'
                    style={{
                        fontSize: 'calc((164 / 1920) * 100vw)',
                        lineHeight: 'calc((160 / 1920) * 100vw)',
                    }}>
                    Metaoptics
                </p>

                <p
                    className='text-center futura-book'
                    style={{
                        fontSize: 'calc((50 / 1920) * 100vw)', // Responsive font size for subheading
                    }}>
                    Redefining what&lsquo;s possible in optical applications.
                </p>

                <button
                    className='px-[60px] py-3 bg-[#C65741] text-white futura-book w-fit mx-auto uppercase'
                    style={{
                        fontSize: 'calc((40 / 1920) * 100vw)', // Responsive button text size
                        marginTop: '9vh',
                        borderBottomRightRadius: '32px',
                    }}>
                    Show More
                </button>
            </div>
        </div>
    );
};

export default Banner;
