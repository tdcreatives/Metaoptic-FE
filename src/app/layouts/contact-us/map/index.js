import Image from 'next/image';

const ContactUsMap = () => {
    return (
        <Image
            width='0'
            height='0'
            priority
            unoptimized
            className='w-full h-auto cursor-pointer'
            alt='Map'
            src='/map.png'
        />
    );
};

export default ContactUsMap;
