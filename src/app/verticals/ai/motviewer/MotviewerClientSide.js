import React from "react";

import Header from "@/layouts/main/header";
import AiMotviewer from "@/layouts/ai-motviewer";
import Footer from "@/layouts/main/footer";

const MotviewerClientSide = () => {
  return (
    <>
      <Header />
      <AiMotviewer />
      <Footer />
    </>
  );
};

export default MotviewerClientSide;
