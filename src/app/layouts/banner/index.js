import Image from 'next/image';

const Banner = () => {
    return (
        <div className='max-w-[78vw] mx-auto relative my-[120px] h-[1450px] flex items-center justify-center'>
            {/* Background Image */}
            <div
                className='absolute inset-0 w-full h-full bg-contain bg-center bg-no-repeat'
                style={{ backgroundImage: "url('/background-banner.svg')" }}
            />

            {/* Content */}
            <div className='relative z-10 flex flex-col'>
                <p className='text-[164px] font-medium text-[#C65741] tracking-widest uppercase text-center futura-book leading-[160px] mt-[100px]'>
                    Metaoptics
                </p>

                <p className='text-[50px] text-center futura-book'>
                    Redefining what&lsquo;s possible in optical applications.
                </p>

                <button
                    className='mt-[100px] px-[60px] py-3 bg-[#C65741] text-white text-[40px] futura-book w-fit mx-auto uppercase'
                    style={{
                        borderBottomRightRadius: '32px',
                    }}>
                    Show More
                </button>
            </div>
        </div>
    );
};

export default Banner;
