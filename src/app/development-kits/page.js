"use client";

import Header from "@/layouts/main/header";
import Footer from "@/layouts/main/footer";
import BaseBanner from "@/components/BaseBanner";
import HeadingTitle from "@/components/HeadingTitle";
import ProductGrid from "@/components/ProductGrid";

const products = [
  {
    name: "IoT Metalens Color Camera",
    slug: "iot-metalens-color-camera",
    image: "/products/product-3.png",
  },
  {
    name: "3D Biometrics Metalens Sensor",
    slug: "3d-biometrics-metalens-sensor",
    image: "/products/product-1.png",
  },
  {
    name: "Ultra-wide FoV Metalens Monochromatic IR Camera",
    slug: "ultra-wide-fov-metalens-monochromatic-ir-camera",
    image: "/products/product-8.png",
  },
];

const DevelopmentKitsPage = () => {
  return (
    <>
      <Header />
      <BaseBanner title="Development Kits" />

      <div className="container xl:py-[120px]">
        <div className="xl:py-[120px]">
          <HeadingTitle title="Introduction" />

          <p className="futura-medium xl:text-xl text-lg">
            MetaOptics Development Kits give engineers and researchers a
            ready-to-use platform for evaluating and integrating our metalens
            technology into their own systems. Each kit pairs our core metalens
            hardware with the software and documentation needed to get up and
            running quickly, shortening the path from evaluation to real-world
            deployment.
          </p>
        </div>

        <ProductGrid products={products} />
      </div>

      <Footer />
    </>
  );
};

export default DevelopmentKitsPage;
