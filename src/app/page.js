import Header from './layouts/main/header';
import Banner from './layouts/homepage/banner';
import WhatWeDo from './layouts/homepage/what-we-do';
import Products from './layouts/homepage/products';
import Footer from './layouts/main/footer';

export const metadata = {
    title: 'Metaoptics Technologies | Leading Metalens Manufacturer Singapore',
    description: 'Metaoptics Technologies offers advanced metalens manufacturing for AR, VR, and IoT devices, delivering miniaturization and high performance to support next-gen optical tech',
    keywords: 'Lens manufacturers, mobile phone cameras, camera lens manufacture, metalens manufacturer'

};

const Home = () => {
    return (
        <>
            <Header />
            <Banner />
            <WhatWeDo />
            <Products />
            <Footer />
        </>
    );
};

export default Home;
