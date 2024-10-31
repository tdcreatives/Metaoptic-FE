import Image from 'next/image';

const GetInTouch = () => {
    return (
        <div className='xl:pt-[200px]'>
            <p className='font-medium text-[#d44c39] tracking-wide uppercase text-center futura-book xl:text-[55px] xl:leading-[6vw] leading-[40px] text-[32px]'>
                GET IN TOUCH WITH US
            </p>

            <div className='xl:py-[84px] flex gap-[72px] justify-center futura-book'>
                <div className='flex flex-col items-center gap-[24px] py-4'>
                    <Image
                        width='0'
                        height='0'
                        priority
                        unoptimized
                        className='w-[25px] h-[25px]'
                        alt='Email'
                        src='/email.svg'
                    />

                    <p className='text-[24px] text-[#121212]'>sales@metaoptics.com.sg</p>
                </div>

                <div className='flex flex-col items-center gap-[24px] px-[72px] py-4 border-l-[2px] border-l-[#d44c39] border-r-[2px] border-r-[#d44c39]'>
                    <Image
                        width='0'
                        height='0'
                        priority
                        unoptimized
                        className='w-[25px] h-[25px]'
                        alt='Location'
                        src='/location.svg'
                    />

                    <p className='text-[24px] text-[#121212] text-center'>
                        81 Ayer Rajah Crescent 01-45 <br />
                        Singapore 139967
                    </p>
                </div>

                <div className='flex flex-col items-center gap-[24px] py-4'>
                    <Image
                        width='0'
                        height='0'
                        priority
                        unoptimized
                        className='w-[25px] h-[25px]'
                        alt='Phone'
                        src='/phone.svg'
                    />

                    <p className='text-[24px] text-[#121212] text-center'>
                        +00 123 45 6789
                    </p>
                </div>
            </div>
        </div>
    );
};

export default GetInTouch;
