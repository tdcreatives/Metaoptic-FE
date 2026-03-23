"use client";

import Header from "@/layouts/main/header";
import Footer from "@/layouts/main/footer";
import BaseBanner from "@/components/BaseBanner";
import Introduction from "./layouts/Introduction";
import NonContactRecognition from "./layouts/NonContactRecognition";
import FingerGestureRecognition from "./layouts/FingerGestureRecognition";
import SuperResolutionImaging from "./layouts/SuperResolutionImaging";
import BrighteningImaging from "./layouts/BrighteningImaging";
import SummaryTable from "./layouts/SummaryTable";
import SharpeningImaging from "./layouts/SharpeningImaging";

const MetaOpticsAI = () => {
  return (
    <>
      <Header />
      <BaseBanner title="Optics Meets Intelligence" />

      <div className="container xl:py-[120px] !py-[64px]">
        <Introduction />
        <SuperResolutionImaging />
        <NonContactRecognition />
        <FingerGestureRecognition />        
        <BrighteningImaging />
        <SharpeningImaging />
        <SummaryTable />
      </div>
      <Footer />
    </>
  );
};

export default MetaOpticsAI;
