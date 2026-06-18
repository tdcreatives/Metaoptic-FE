import React from "react";

import Header from "@/layouts/main/header";
import ProductProjectionModules from "@/layouts/product-projection-modules";
import Footer from "@/layouts/main/footer";

const ProjectionModulesClientSide = () => {
  return (
    <>
      <Header />
      <ProductProjectionModules />
      <Footer />
    </>
  );
};

export default ProjectionModulesClientSide;
