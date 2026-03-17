"use client";

import Header from "@/layouts/main/header";
import Footer from "@/layouts/main/footer";
import BaseBanner from "@/components/BaseBanner";
import { isMobile } from "@/utils";
import HeadingTitle from "@/components/HeadingTitle";
import FourInPlatformsLayout from "./layouts/4In";
import TwelveInPlatformsLayout from "./layouts/12In";
import PlatformComparison from "./layouts/plaform-comparison";

const FourInTwelveInPlatforms = () => {
  return (
    <>
      <Header />

      <BaseBanner>
        <h1 className="text-black text-[36px] md:text-[60px] xl:text-[84px] font-medium uppercase leading-tight futura-condensed-medium xl:tracking-[2px]">
          Custom Metalens Fabrication,
          {isMobile() ? null : <br />} Built to Your Requirements
        </h1>

        <p className="futura-medium mx-auto xl:text-[24px] xl:leading-[1.5] text-black text-[16px] leading-[1.5] xl:max-w-[60%] w-full xl:mt-8 mt-4">
          Whether you need a small batch for early-stage development or
          high-volume production at scale, MetaOptics provides a fabrication
          platform matched to your needs, from prototype to mass production.
        </p>
      </BaseBanner>

      <div className="container xl:pb-[120px] !pb-[64px]">
        <div className="xl:pt-[120px] pt-[60px]">
          <HeadingTitle title="Two platforms. One goal: precision at every scale." />
          <p className="futura-medium xl:text-xl text-base text-[#111111]">
            MetaOptics offers two dedicated fabrication platforms for producing
            custom metalenses, giving customers the flexibility to choose the
            right process for their stage of development and volume
            requirements. Both platforms support various materials including
            glass and silicon, and are engineered to deliver the nanoscale
            precision that metalens production demands.
          </p>
        </div>

        <FourInPlatformsLayout />
        <TwelveInPlatformsLayout />
        <PlatformComparison />
      </div>
      <Footer />
    </>
  );
};

export default FourInTwelveInPlatforms;
