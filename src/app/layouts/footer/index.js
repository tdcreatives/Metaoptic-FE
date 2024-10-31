import Image from 'next/image';

const Footer = () => {
    return (
        <div className='bg-[#131313] futura-book px-[5.2vw] xl:py-[12.31vh] py-[48px] relative'>
            <div className='flex justify-between'>
                <div className='flex flex-col xl:gap-[5.6vh] gap-4'>
                    <p className='text-[#888888] tracking-wider xl:text-[3.77vw] text-[24px]'>
                        Connect with us
                    </p>

                    <div className='futura-book xl:text-[1.25vw] text-[12px]'>
                        <p className='text-[#d44c39]'>Metaoptics Technologies Pte Ltd</p>

                        <p className='text-[#E0E1E0]'>
                            <span className='text-[#888888]'>Address: </span>81 Ayer Rajah
                            Crescent 01-45 Singapore 139967
                        </p>

                        <a href='mailto:sales@metaoptics.com.sg'>
                            <p className='text-[#E0E1E0] mt-2'>
                                {' '}
                                <span className='text-[#888888]'>Email: </span>
                                sales@metaoptics.com.sg
                            </p>
                        </a>
                    </div>
                </div>

                <Image
                    src='/footer.png'
                    width='0'
                    height='0'
                    priority
                    className='h-auto xl:block hidden'
                    unoptimized
                    style={{
                        width: '40vw',
                        objectFit: 'contain',
                    }}
                    alt='Footer Element'
                />
            </div>
            <div className='flex xl:flex-row flex-col justify-between xl:text-[1.1vw] text-[12px] text-[#f0efef] xl:mt-[11.1vh] mt-[48px]'>
                <div className='flex gap-[5vw]'>
                    <a href='#'>
                        <p>Privacy & Legal</p>
                    </a>

                    <a href='#'>
                        <p>Cookies Policy</p>
                    </a>
                    <a href='#'>
                        <p>Data Privacy</p>
                    </a>
                </div>

                <div className='flex xl:justify-center xl:w-[33.3vw] xl:mt-0 mt-2'>
                    <a href='#'>
                        <p>Follow Us</p>
                    </a>
                </div>
            </div>

            <div className='text-center xl:text-[1.1vw] text-[12px] text-[#888888] xl:mt-[17.6vh] mt-[72px]'>
                Metaoptics Technologies Pte Ltd. All rights reserved
            </div>

            <Image
                src='/footer.png'
                width='0'
                height='0'
                priority
                className='h-auto w-[70vw] sm:w-[50vw] xl:relative absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[100%] xl:hidden block'
                unoptimized
                style={{
                    objectFit: 'contain',
                }}
                alt='Footer Element'
            />
        </div>
    );
};

export default Footer;
