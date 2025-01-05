import Header from '@/layouts/main/header';
// import ContactBanner from '@/layouts/contact-us/banner';
import GetInTouch from '@/layouts/contact-us/get-in-touch';
import ContactUsForm from '@/layouts/contact-us/form';
import ContactUsMap from '@/layouts/contact-us/map';
import Footer from '@/layouts/main/footer';

export const metadata = {
    title: 'Metaoptics Technologies | Leading Metalens Manufacturer Singapore',
    description:
        'Metaoptics Technologies offers advanced metalens manufacturing for AR, VR, and IoT devices, delivering miniaturization and high performance to support next-gen optical tech',
    keywords:
        'Lens manufacturers, mobile phone cameras, camera lens manufacture, metalens manufacturer',
};

const ContactUs = () => {
    return (
        <>
            <Header />
            {/* <ContactBanner /> */}
            <GetInTouch />
            <ContactUsForm />
            {/* <ContactUsMap /> */}
            <Footer />
        </>
    );
};

export default ContactUs;
