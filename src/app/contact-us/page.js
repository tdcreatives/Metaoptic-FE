import Header from '@/app/layouts/main/header';
import ContactBanner from '../layouts/contact-us/banner';
import GetInTouch from '../layouts/contact-us/get-in-touch';
import ContactUsForm from '../layouts/form';
import Footer from '@/app/layouts/main/footer';

const ContactUs = () => {
    return (
        <>
            <Header />
            <ContactBanner />
            <GetInTouch />
            <ContactUsForm />
            <Footer />
        </>
    );
};

export default ContactUs;
