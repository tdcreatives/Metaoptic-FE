import Header from './layouts/main/header';
import Banner from './layouts/homepage/banner';
import WhatWeDo from './layouts/homepage/what-we-do';
import Products from './layouts/homepage/products';
import Footer from './layouts/main/footer';

export const metadata = {
    title: 'Homepage',
    description: 'Metaoptics is a design system for building modern web applications.',
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
