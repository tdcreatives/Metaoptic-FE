"use client";

import Header from "@/layouts/main/header";
import Footer from "@/layouts/main/footer";
import BaseBanner from "@/components/BaseBanner";
import HeadingTitle from "@/components/HeadingTitle";
import ProductGrid from "@/components/ProductGrid";

const products = [
  {
    name: "Metalens 5G Smartphone",
    slug: "metalens-5g-smartphone",
    image: "/products/metalens-5g-smartphone.png",
    imageClassName: "xl:scale-[60%]",
  },
  {
    name: "Projector (2nd generation)",
    slug: "pico-projector-2nd-generation",
    image: "/products/pico-projector-2nd-generation.png",
  },
  {
    name: "Metalens AI Glasses",
    slug: "metalens-ai-glasses",
    image: "/products/metalens-ai-glasses.png",
    imageClassName: "xl:scale-[80%]",
  },
  {
    name: "Development Kits",
    slug: "development-kits",
    image: "/products/development-kits.png",
  },
];

const MetalensProductsPage = () => {
  return (
    <>
      <Header />
      <BaseBanner title="Metalens Products" />

      <div className="container xl:pb-[120px] !pb-[64px]">
        <div className="xl:py-[120px] pt-[64px] pb-[56px]">
          <HeadingTitle title="Introduction" />

          <p className="futura-medium xl:text-xl text-[14px]">
            MetaOptics metalens products bring the breakthrough capabilities of
            flat optics into real-world devices. From compact imaging systems to
            next-generation smartphones and projection hardware, each product is
            built around our core metalens technology, delivering superior
            optical performance in form factors that conventional lens systems
            cannot achieve.
          </p>
        </div>

        <ProductGrid products={products} />
      </div>

      <Footer />
    </>
  );
};

export default MetalensProductsPage;
