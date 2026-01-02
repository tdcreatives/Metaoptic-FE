import metadataJson from "@/constants/metadata.json";
import Header from "../layouts/main/header";
import Banner from "../layouts/homepage/banner";
import AboutUs from "../layouts/homepage/about-us";
import Products from "../layouts/homepage/products";
import TorchlightText from "@/layouts/homepage/torch-light";
import News from "../layouts/homepage/news";
import Footer from "../layouts/main/footer";

export const metadata = {
  title: metadataJson.homepage.title,
  description: metadataJson.homepage.description,
  keywords: metadataJson.homepage.keywords,
  openGraph: {
    images: [metadataJson.homepage.ogImage],
    url: metadataJson.homepage.ogUrl,
    type: metadataJson.homepage.ogType,
    siteName: metadataJson.homepage.ogSiteName,
    locale: metadataJson.homepage.ogLocale,
  },
  twitter: {
    card: metadataJson.homepage.twitterCard,
    creator: metadataJson.homepage.twitterCreator,
    site: metadataJson.homepage.twitterSite,
    title: metadataJson.homepage.twitterTitle,
    description: metadataJson.homepage.twitterDescription,
  },
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
