import { buildPageMetadataFromSection } from "@/lib/seo";
import Header from "../layouts/main/header";
import Banner from "../layouts/homepage/banner";
import AboutUs from "../layouts/homepage/about-us";
import Products from "../layouts/homepage/products";
import TorchlightText from "@/layouts/homepage/torch-light";
import News from "../layouts/homepage/news";
import Footer from "../layouts/main/footer";
import Awards from "../layouts/homepage/awards";

export const metadata = buildPageMetadataFromSection("homepage");

const Home = () => {
  return (
    <>
      <Header />
      <Banner />
      <AboutUs />
      <Products />
      <TorchlightText />
      <Awards />
      <News />
      <Footer />
    </>
  );
};

export default Home;
