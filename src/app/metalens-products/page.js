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
  },
];

const MetalensProductsPage = () => {
  return (
    <>
      <Header />
      <BaseBanner title="Metalens Products" />

      <div className="container xl:py-[120px]">
        <div className="xl:py-[120px]">
          <HeadingTitle title="Introduction" />

          <p className="futura-medium xl:text-xl text-lg">
            MetaOptics metalens equipment represents the fabrication
            infrastructure behind next-generation flat optics. Our portfolio of
            direct laser writing, testing and assembling systems enables the
            precise nanoscale patterning required to produce high-performance
            metalenses at research and production scale, giving institutions and
            manufacturers the tools to bring metalens technology from concept to
            reality.
          </p>
        </div>

        <ProductGrid products={products} />
      </div>

      <Footer />
    </>
  );
};

export default MetalensProductsPage;
