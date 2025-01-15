import Header from '@/layouts/main/header';
// import ContactBanner from '@/layouts/contact-us/banner';
import GetInTouch from '@/layouts/contact-us/get-in-touch';
import ContactUsForm from '@/layouts/contact-us/form';
import Footer from '@/layouts/main/footer';

const ContactUsClientSide = () => {
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

export default ContactUsClientSide;
