import Image from 'next/image';

const Footer = () => {
    return (
        <div className='bg-[#131313] futura-book px-[5.2vw] xl:py-[12.31vh] py-[48px]'>
            <div className='flex justify-between'>
                <div className='flex flex-col xl:gap-[5.6vh] gap-4'>
                    <p className='text-[#888888] tracking-wider xl:text-[3.77vw] text-[24px]'>
                        Connect with us
                    </p>

                    <div className='futura-book xl:text-[1.25vw] text-[12px]'>
                        <p className='text-[#C05540]'>Metaoptics Technologies Pte Ltd</p>

                        <p className='text-[#E0E1E0]'>
                            <span className='text-[#888888]'>Address: </span>81 Ayer Rajah
                            Crescent 01-45 Singapore 139967
                        </p>

                        <a href='mailto:sales@metaoptics.com.sg'>
                            <p className='text-[#E0E1E0]'>
                                {' '}
                                <span className='text-[#888888]'>Email: </span>
                                sales@metaoptics.com.sg
                            </p>
                        </a>
                    </div>
                </div>

                <Image
                    src='/footer-element.svg'
                    width='0'
                    height='0'
                    priority
                    sizes='100vw'
                    className='h-auto'
                    style={{
                        width: '33.3vw',
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
        </div>
    );
};

export default Footer;
