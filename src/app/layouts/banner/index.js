import Image from 'next/image';

const Banner = () => {
    return (
        <div className='max-w-[78vw] mx-auto relative mb-[5vh] flex items-center justify-center h-[80vh]'>
            <Image
                src='/background-banner.svg'
                alt='Background Banner'
                width='0'
                height='0'
                className='w-full h-full cursor-pointer absolute top-0 left-0'
                priority
            />

            <div className='relative z-10 flex flex-col pt-[3vh]'>
                <p className='font-medium text-[#C65741] tracking-widest uppercase text-center futura-book text-[6vw] leading-[6vw]'>
                    Metaoptics
                </p>

                <p className='text-center futura-book text-[1.8vw]'>
                    Redefining what&lsquo;s possible in optical applications.
                </p>

                <button className='px-[2vw] py-3 bg-[#C65741] text-white futura-book w-fit mx-auto uppercase text-[1.25vw] mt-[5vh] rounded-br-[32px]'>
                    Show More
                </button>
            </div>
        </div>
    );
};

export default Banner;
