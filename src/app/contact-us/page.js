import Header from '@/app/layouts/main/header';
import ContactBanner from '../layouts/contact-us/banner';
import GetInTouch from '../layouts/contact-us/get-in-touch';
import ContactUsForm from '../layouts/contact-us/form';
import ContactUsMap from '../layouts/contact-us/map';
import Footer from '@/app/layouts/main/footer';

export const metadata = {
    title: 'Contact Us',
    description: 'Metaoptics is a design system for building modern web applications.',
};

const ContactUs = () => {
    return (
        <>
            <Header />
            <ContactBanner />
            <GetInTouch />
            <ContactUsForm />
            <ContactUsMap />
            <Footer />
        </>
    );
};

export default ContactUs;
