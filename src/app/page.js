import metadataJson from '@/constants/metadata.json';
import Header from '../layouts/main/header';
import Banner from '../layouts/homepage/banner';
import AboutUs from '../layouts/homepage/about-us';
import Products from '../layouts/homepage/products';
import TorchlightText from '@/layouts/homepage/torch-light';
import News from '../layouts/homepage/news';
import Footer from '../layouts/main/footer';

export const metadata = {
    title: metadataJson.homepage.title,
    description: metadataJson.homepage.description,
    keywords: metadataJson.homepage.keywords,
};

const Home = () => {
    return (
        <>
            <Header />
            <Banner />
            <AboutUs />
            <Products />
            <TorchlightText />
            <News />
            <Footer />
        </>
    );
};

export default Home;
