import Image from 'next/image';

const GetInTouch = () => {
    return (
        <div className='xl:pt-[120px] pt-[32px]'>
            <h2 className='xl:text-[150px] text-[64px] text-[#d34c39] uppercase futura-condensed-medium text-center'>
                CONTACT US
            </h2>

            <div className='xl:mt-0 mt-8 mb-10 xl:max-w-[60%] max-w-[90%] mx-auto text-center text-[24px] futura-medium text-[#121212]'>
                Feel free to contact us any time. <br /> We will get back to you as soon
                as we can!
            </div>

            {/* <div className='xl:py-[84px] flex xl:gap-[72px] gap-[24px] justify-center futura-book py-[32px] xl:flex-row flex-col'>
                <div className='flex flex-col items-center gap-[24px] py-4 xl:pl-[120px]'>
                    <Image
                        width='0'
                        height='0'
                        priority
                        unoptimized
                        className='w-[25px] h-[25px]'
                        alt='Email'
                        src='/email.svg'
                    />

                    <p className='xl:text-[24px] text-[18px] text-[#121212]'>
                        sales@metaoptics.sg
                    </p>
                </div>

                <div className='flex flex-col items-center gap-[24px] px-[72px] xl:py-4 py-6 xl:border-l-[2px] xl:border-l-[#d44c39] border-t-[2px] border-t-[#d44c39] border-b-[2px] border-b-[#d44c39] xl:border-t-[0px] xl:border-b-[0px] xl:w-[auto] w-[90vw] xl:mx-[0px] mx-auto xl:border-r-[0px] border-b-[0]'>
                    <Image
                        width='0'
                        height='0'
                        priority
                        unoptimized
                        className='w-[25px] h-[25px]'
                        alt='Location'
                        src='/location.svg'
                    />

                    <p className='xl:text-[24px] text-[18px] text-[#121212] text-center whitespace-nowrap'>
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

                    <p className='xl:text-[24px] text-[18px] text-[#121212]'>
                        +00 123 45 6789
                    </p>
                </div>
            </div> */}
        </div>
    );
};

export default GetInTouch;
