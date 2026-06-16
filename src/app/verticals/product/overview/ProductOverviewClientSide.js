import React from "react";

import Header from "@/layouts/main/header";
import ProductOverview from "@/layouts/product-overview";
import Footer from "@/layouts/main/footer";

const ProductOverviewClientSide = () => {
  return (
    <>
      <Header />
      <ProductOverview />
      <Footer />
    </>
  );
};

export default ProductOverviewClientSide;
