"use client";

import Header from "@/layouts/main/header";
import Footer from "@/layouts/main/footer";
import BaseBanner from "@/components/BaseBanner";
import HeadingTitle from "@/components/HeadingTitle";
import ProductGrid from "@/components/ProductGrid";

const products = [
  {
    name: "3D Biometrics Metalens Sensor",
    slug: "3d-biometrics-metalens-sensor",
    href: "/verticals/metalens-products/development-kits/3d-biometrics-metalens-sensor",
    image: "/products/product-1.png",
    imageClassName: "xl:scale-[60%]",
  },
  {
    name: "IoT Metalens Color Camera",
    slug: "iot-metalens-color-camera",
    href: "/verticals/metalens-products/development-kits/iot-metalens-color-camera",
    image: "/products/product-3.png",
    imageClassName: "xl:scale-[50%]",
  },
  {
    name: "IoT Rectangular Metalens Color Camera",
    slug: "iot-rectangular-metalens-color-camera",
    href:
      "/verticals/metalens-products/development-kits/iot-rectangular-metalens-color-camera",
    image: "/products/iot-metalens-color-camera.png",
    imageClassName: "xl:scale-[50%]",
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

      <div className="container xl:pb-[120px] !pb-[64px]">
        <div className="xl:py-[120px] pt-[64px] pb-[56px]">
          <HeadingTitle title="Introduction" />

          <p className="futura-medium xl:text-xl text-[14px]">
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
