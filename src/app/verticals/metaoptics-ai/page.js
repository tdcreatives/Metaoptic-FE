"use client";

import Header from "@/layouts/main/header";
import Footer from "@/layouts/main/footer";
import BaseBanner from "@/components/BaseBanner";
import Introduction from "./layouts/Introduction";
import BiometricsAI from "./layouts/BiometricsAI";
import GestureRecognitionAI from "./layouts/GestureRecognitionAI";
import ImagingEnhancementAI from "./layouts/ImagingEnhancementAI";
import MotViewer from "./layouts/MotViewer";

const MetaOpticsAI = () => {
  return (
    <>
      <Header />
      <BaseBanner title="Optics Meets Intelligence" />

      <div className="container xl:py-[120px] !py-[64px]">
        <Introduction />
        <BiometricsAI />
        <GestureRecognitionAI />
        <ImagingEnhancementAI />
        <MotViewer />
      </div>
      <Footer />
    </>
  );
};

export default MetaOpticsAI;
