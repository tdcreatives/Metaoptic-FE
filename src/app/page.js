import Header from './layouts/main/header';
import Banner from './layouts/homepage/banner';
import AboutUs from './layouts/homepage/about-us';
import Products from './layouts/homepage/products';
import Quote from './layouts/homepage/quote';
import News from './layouts/homepage/news';
import Footer from './layouts/main/footer';

export const metadata = {
    title: 'Metaoptics Technologies | Leading Metalens Manufacturer Singapore',
    description:
        'Metaoptics Technologies offers advanced metalens manufacturing for AR, VR, and IoT devices, delivering miniaturization and high performance to support next-gen optical tech',
    keywords:
        'Lens manufacturers, mobile phone cameras, camera lens manufacture, metalens manufacturer',
};

const Home = () => {
    return (
        <>
            <Header />
            <Banner />
            <AboutUs />
            <Products />
            <Quote />
            <News />
            <Footer />
        </>
    );
};

export default Home;
