import Image from 'next/image';

const Footer = () => {
    return (
        <div
            className='bg-[#131313] futura-book'
            style={{
                padding: '12.31vh 5.2vw', // 133px to vh and 100px to vw
            }}>
            <div className='flex justify-between'>
                <div className='flex flex-col gap-[5.6vh]'>
                    <p
                        className='text-[#888888] tracking-wider'
                        style={{
                            fontSize: '3.77vw', // 72.4px to vw
                        }}>
                        Connect with us
                    </p>

                    <div className='futura-book' style={{ fontSize: '1.25vw' }}>
                        <p className='text-[#C05540]'>Metaoptics Technologies Pte Ltd</p>

                        <p className='text-[#E0E1E0]'>
                            81 Ayer Rajah Crescent 01-45 Singapore 139967
                        </p>

                        <a href='mailto:sales@metaoptics.com.sg'>
                            <p className='text-[#E0E1E0]'>sales@metaoptics.com.sg</p>
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
                        width: '33.3vw', // 640px to vw
                    }}
                    alt='Footer Element'
                />
            </div>

            <div
                className='flex justify-between'
                style={{
                    fontSize: '1.1vw', // 21px to vw
                    color: '#F0EFEF',
                    marginTop: '11.1vh', // 120px to vh
                }}>
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

                <div
                    className='flex justify-center'
                    style={{
                        width: '33.3vw', // 640px to vw
                    }}>
                    <a href='#'>
                        <p>Follow Us</p>
                    </a>
                </div>
            </div>

            <div
                className='text-center'
                style={{
                    fontSize: '1.1vw', // 21px to vw
                    color: '#888888',
                    marginTop: '17.6vh', // 190px to vh
                }}>
                Metaoptics Technologies Pte Ltd. All rights reserved
            </div>
        </div>
    );
};

export default Footer;
