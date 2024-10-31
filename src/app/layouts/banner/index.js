import Image from 'next/image';

const Banner = () => {
    return (
        <div className='max-w-[78vw] mx-auto relative mb-[5vh] flex items-center justify-center xl:h-[80vh] h-[300px]'>
            <Image
                src='/background-banner.svg'
                alt='Background Banner'
                width='0'
                height='0'
                className='w-full h-full cursor-pointer absolute top-0 left-0'
                priority
            />

            <div className='relative z-10 flex flex-col pt-[3vh]'>
                <p className='font-medium text-[#C65741] tracking-widest uppercase text-center futura-book xl:text-[6vw] xl:leading-[6vw] leading-[40px] text-[32px]'>
                    Metaoptics
                </p>

                <p className='text-center futura-book xl:text-[1.8vw] text-[16px]'>
                    Redefining what&lsquo;s possible in optical applications.
                </p>

                <button className='xl:px-[2vw] px-[24px] py-3 bg-[#d44c39] text-white futura-book w-fit mx-auto uppercase xl:text-[1.25vw] text-[12px] xl:mt-[5vh] mt-[24px] rounded-br-[32px]'>
                    Show More
                </button>
            </div>
        </div>
    );
};

export default Banner;
