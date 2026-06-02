"use client";

import React from "react";

import { useParams } from "next/navigation";
import Link from "next/link";
import data from "@/constants/data.json";

import Header from "@/layouts/main/header";
import Footer from "@/layouts/main/footer";

import ProductDetailsBanner from "@/layouts/product-details/banner";
import ProductDetailsSpecifications from "@/layouts/product-details/specifications";
import ProductDetailsTestingCapabilities from "@/layouts/product-details/testing-capabilities";
import ProductDetailsMeasuredParameters from "@/layouts/product-details/measured-parameters";
import RelatedProducts from "@/layouts/product-details/related-products";
import ProductDetailsKeyFeatures from "@/layouts/product-details/key-features";
import ProductDetailsKeyFeaturesGrid from "@/layouts/product-details/key-features-grid";
import ProductDetailsDualColumnList from "@/layouts/product-details/dual-column-list";
import ProductDetailsPlatformVersions from "@/layouts/product-details/platform-versions";
import ProductDetailsModuleGrid from "@/layouts/product-details/module-grid";
import ProductDetailsSpecTable from "@/layouts/product-details/spec-table";
import ProductDetailsUpgradability from "@/layouts/product-details/upgradability";
import ProductDetailsCtaBanner from "@/layouts/product-details/cta-banner";

const ProductDetailsClientSide = () => {
  const { slug } = useParams();

  const product = data.products.find((item) => item.slug === slug);

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-4xl font-semibold text-red-500">
          Product Not Found
        </h1>
        <Link
          href="/"
          className="mt-4 bg-[#d34c39] text-white px-4 py-2 rounded-lg inline-block"
        >
          Go Back to Home
        </Link>
      </div>
    );
  }

  return (
    <>
      <Header background="#f0f0f0" />

      <ProductDetailsBanner product={product} />

      {product?.details?.keyFeatures && (
        <ProductDetailsKeyFeatures
          keyFeatures={product?.details?.keyFeatures}
        />
      )}

      {product?.details?.keyFeaturesGrid && (
        <ProductDetailsKeyFeaturesGrid
          keyFeaturesGrid={product?.details?.keyFeaturesGrid}
        />
      )}

      {product?.details?.dualColumnList && (
        <ProductDetailsDualColumnList
          dualColumnList={product?.details?.dualColumnList}
        />
      )}

      {product?.details?.platformVersions && (
        <ProductDetailsPlatformVersions
          platformVersions={product?.details?.platformVersions}
        />
      )}

      {product?.details?.moduleGrid && (
        <ProductDetailsModuleGrid moduleGrid={product?.details?.moduleGrid} />
      )}

      {product?.details?.specTable && (
        <ProductDetailsSpecTable
          specTable={product?.details?.specTable}
          brochure={product?.brochure}
        />
      )}

      {product?.details?.upgradability && (
        <ProductDetailsUpgradability
          upgradability={product?.details?.upgradability}
        />
      )}

      {product?.details?.ctaBanner && (
        <ProductDetailsCtaBanner ctaBanner={product?.details?.ctaBanner} />
      )}

      {product?.details?.specifications && (
        <ProductDetailsSpecifications
          specifications={product?.details?.specifications}
          brochureTitle={product?.name}
          brochure={product?.brochure}
          buttonLeft={product?.buttonLeft}
          buttonRight={product?.buttonRight}
        />
      )}

      {product?.details?.testingCapabilities && (
        <ProductDetailsTestingCapabilities
          testingCapabilities={product?.details?.testingCapabilities}
          buttonLeft={product?.buttonLeft}
          buttonRight={product?.buttonRight}
        />
      )}

      {product?.details?.measuredParameters && (
        <ProductDetailsMeasuredParameters
          measuredParameters={product?.details?.measuredParameters}
        />
      )}

      <RelatedProducts
        relatedProducts={product?.details?.relatedProducts || []}
      />

      <Footer />
    </>
  );
};

export default ProductDetailsClientSide;
