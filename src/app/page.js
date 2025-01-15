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
    ogImage: metadataJson.homepage.ogImage,
    ogUrl: metadataJson.homepage.ogUrl,
    ogType: metadataJson.homepage.ogType,
    ogSiteName: metadataJson.homepage.ogSiteName,
    ogLocale: metadataJson.homepage.ogLocale,
    twitterCard: metadataJson.homepage.twitterCard,
    twitterCreator: metadataJson.homepage.twitterCreator,
    twitterSite: metadataJson.homepage.twitterSite,
    twitterTitle: metadataJson.homepage.twitterTitle,
    twitterDescription: metadataJson.homepage.twitterDescription,
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
