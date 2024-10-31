import Image from 'next/image';

const ContactUsForm = () => {
    return (
        <>
            <div className='w-[36vw] mx-auto'>
                <form className='space-y-[32px]'>
                    <div className='flex space-x-4'>
                        <input
                            type='text'
                            placeholder='First Name'
                            className='futura-book text-[24px] text-[#121212] placeholder-[#A7A7A7] bg-[#F5F5F5] w-full p-4 rounded-sm'
                        />
                        <input
                            type='text'
                            placeholder='Last Name'
                            className='futura-book text-[24px] text-[#121212] placeholder-[#A7A7A7] bg-[#F5F5F5] w-full p-4 rounded-sm'
                        />
                    </div>
                    <input
                        type='email'
                        placeholder='Email'
                        className='futura-book text-[24px] text-[#121212] placeholder-[#A7A7A7] bg-[#F5F5F5] w-full p-4 rounded-sm'
                    />
                    <input
                        type='text'
                        placeholder='Subject'
                        className='futura-book text-[24px] text-[#121212] placeholder-[#A7A7A7] bg-[#F5F5F5] w-full p-4 rounded-sm'
                    />
                    <textarea
                        placeholder='Message'
                        className='futura-book text-[24px] text-[#121212] placeholder-[#A7A7A7] bg-[#F5F5F5] w-full p-4 h-32 rounded-sm'></textarea>
                    <div className='flex justify-center'>
                        <button
                            type='submit'
                            className='futura-book bg-[#D95442] text-white text-[24px] py-2 px-8 rounded-sm'>
                            SUBMIT
                        </button>
                    </div>
                </form>
            </div>

            <div className='flex justify-center gap-[48px] xl:py-[118px]'>
                {' '}
                <Image
                    width='0'
                    height='0'
                    priority
                    unoptimized
                    className='w-[36px] h-[36px] cursor-pointer'
                    alt='Facebook'
                    src='/facebook.svg'
                />
                <Image
                    width='0'
                    height='0'
                    priority
                    unoptimized
                    className='w-[36px] h-[36px] cursor-pointer'
                    alt='Twitter'
                    src='/twitter.svg'
                />
                <Image
                    width='0'
                    height='0'
                    priority
                    unoptimized
                    className='w-[36px] h-[36px] cursor-pointer'
                    alt='Instagram'
                    src='/instagram.svg'
                />
            </div>
        </>
    );
};

export default ContactUsForm;
