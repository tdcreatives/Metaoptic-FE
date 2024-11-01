// import Image from 'next/image';

const ContactUsForm = () => {
    return (
        <>
            <div className='xl:w-[40vw] mx-auto w-[90vw] xl:pb-[118px] pb-[48px]'>
                <form className='xl:space-y-[32px] space-y-4' method='POST' action='https://api.web3forms.com/submit'>
                    <input
                        type='hidden'
                        name='access_key'
                        value={process.env.WEB3FORM_ACCESS_KEY}
                    />
                    <input
                        type='hidden'
                        name='subject'
                        value='New Submission from Metaoptics'
                    />
                    <input type='hidden'
                        name='email'
                        value={process.env.WEB3FORM_EMAIL}
                    />
                    <input
                        type='hidden'
                        name='redirect'
                        value='https://web3forms.com/success'
                    />
                    <input
                        type='checkbox'
                        name='botcheck'
                        id=''
                        style={{ display: 'none' }}
                    />
                    <input
                        type='hidden'
                        name='from_name'
                        value='Metaoptics Contact Us'
                    />
                    <div className='flex space-x-4'>
                        <input
                            type='text' name="customer_first_name"
                            placeholder='First Name'
                            className='futura-book xl:text-[24px] text-[16px] text-[#121212] placeholder-[#A7A7A7] bg-[#F5F5F5] w-full p-4 rounded-sm'
                        />
                        <input
                            type='text' name="customer_last_name"
                            placeholder='Last Name'
                            className='futura-book xl:text-[24px] text-[16px] text-[#121212] placeholder-[#A7A7A7] bg-[#F5F5F5] w-full p-4 rounded-sm'
                        />
                    </div>
                    <input
                        type='email' name="customer_email"
                        placeholder='Email'
                        className='futura-book xl:text-[24px] text-[16px] text-[#121212] placeholder-[#A7A7A7] bg-[#F5F5F5] w-full p-4 rounded-sm'
                    />
                    <input
                        type='text' name="customer_subject"
                        placeholder='Subject'
                        className='futura-book xl:text-[24px] text-[16px] text-[#121212] placeholder-[#A7A7A7] bg-[#F5F5F5] w-full p-4 rounded-sm'
                    />
                    <textarea
                        placeholder='Message'
                        name="customer_message"
                        className='futura-book xl:text-[24px] text-[16px] text-[#121212] placeholder-[#A7A7A7] bg-[#F5F5F5] w-full p-4 h-32 rounded-sm'></textarea>
                    <div className='flex justify-center'>
                        <button
                            type='submit'
                            className='futura-book bg-[#D95442] text-white xl:text-[24px] text-[18px] py-2 xl:px-8 px-6 rounded-sm'>
                            SUBMIT
                        </button>
                    </div>
                </form>
            </div>

            {/* <div className='flex justify-center gap-[48px] xl:py-[118px] py-[48px]'>
                {' '}
                <Image
                    width='0'
                    height='0'
                    priority
                    unoptimized
                    className='xl:w-[36px] xl:h-[36px] w-6 h-6 cursor-pointer'
                    alt='Facebook'
                    src='/facebook.svg'
                />
                <Image
                    width='0'
                    height='0'
                    priority
                    unoptimized
                    className='xl:w-[36px] xl:h-[36px] w-6 h-6 cursor-pointer'
                    alt='Twitter'
                    src='/twitter.svg'
                />
                <Image
                    width='0'
                    height='0'
                    priority
                    unoptimized
                    className='xl:w-[36px] xl:h-[36px] w-6 h-6 cursor-pointer'
                    alt='Instagram'
                    src='/instagram.svg'
                />
            </div> */}
        </>
    );
};

export default ContactUsForm;
