"use client";

import Header from "@/layouts/main/header";
import Footer from "@/layouts/main/footer";
import BaseBanner from "@/components/BaseBanner";
import HeadingTitle from "@/components/HeadingTitle";
import ProductGrid from "@/components/ProductGrid";

const products = [
  {
    name: "Direct Laser Writer",
    image: "/products/product-7.png",
    category: "Metalens Equipment",
    slug: "laser-writer",
  },
  {
    name: "Metalens Automatic Tester",
    nameDom:
      "Metalens <br /> <div class='name-dom-metalens-tester--first'>Automatic </div> <br /> <div class='name-dom-metalens-tester--second'>Tester</div>",
    slug: "metalens-automatic-tester",
    image: "/products/product-10.png",
  },
  {
    name: "Automated Metalens Camera Module <br /> Assembly and Test System (A&T) 2026",
    slug: "automated-metalens-camera-module-assembly-and-test-system",
    image:
      "/products/product-automated-metalens-camera-module-assembly-and-test-system.png",
  },
];

const MetalensEquipmentPage = () => {
  return (
    <>
      <Header />
      <BaseBanner title="Metalens Equipment" />

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

export default MetalensEquipmentPage;
