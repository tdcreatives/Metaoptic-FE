"use client";

import Header from "@/layouts/main/header";
import Footer from "@/layouts/main/footer";
import BaseBanner from "@/components/BaseBanner";
import HeadingTitle from "@/components/HeadingTitle";
import ProductGrid from "@/components/ProductGrid";

const products = [
  {
    name: "4in & 12in Platforms",
    image: "/products/4in12in.png",
    slug: "4in-12in-platforms",
  },
  {
    name: "Color Imaging Metalens",
    slug: "color-imaging-meta-lens",
    image: "/products/color-imaging-meta-lens.png",
  },
  {
    name: "Ultra-wide FoV IR Metalens",
    slug: "ultra-wide-fov-ir-metalens",
    image: "/products/product-6.png",
  },
  {
    name: "Ultra-wide FoV Metalens Monochromatic IR Camera",
    slug: "ultra-wide-fov-metalens-monochromatic-ir-camera",
    image: "/products/product-8.png",
  },
  {
    name: "Co-Packaged Optics",
    slug: "co-packaged-optics",
    image: "/products/cpo.png",
  },
];

const MetalensFoundryPage = () => {
  return (
    <>
      <Header />
      <BaseBanner title="Metalens Foundry" />

      <div className="container xl:py-[120px]">
        <div className="xl:py-[120px]">
          <HeadingTitle title="Introduction" />

          <p className="futura-medium xl:text-xl text-lg">
            MetaOptics Foundry represents our in-house capability to design,
            fabricate, and produce metalenses at scale. Built on 4-inch and
            12-inch wafer platforms, our foundry covers a growing range of
            products including color imaging metalenses, infrared metalenses,
            and ultra-wide lenses. From initial design to finished product, we
            own the full production process.
          </p>
        </div>

        <ProductGrid products={products} />
      </div>

      <Footer />
    </>
  );
};

export default MetalensFoundryPage;
