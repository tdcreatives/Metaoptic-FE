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
  },
  {
    name: "Pico Projector",
    slug: "pico-projector",
    image: "/products/product-5.png",
  },
  {
    name: "Metalens AI Glasses",
    slug: "metalens-ai-glasses",
    image: "/products/metalens-ai-glasses.png",
  },
  {
    name: "Development Kits",
    slug: "development-kits",
    image: "/products/development-kits.png",
    isNonProduct: true,
  },
];

const MetalensProductsPage = () => {
  return (
    <>
      <Header />
      <BaseBanner title="Metalens Products" />

      <div className="container xl:pb-[120px]">
        <div className="xl:py-[120px]">
          <HeadingTitle title="Introduction" />

          <p className="futura-medium xl:text-xl text-lg">
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
