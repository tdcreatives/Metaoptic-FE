"use client";

import Header from "@/layouts/main/header";
import Footer from "@/layouts/main/footer";
import BaseBanner from "@/components/BaseBanner";
import { isMobile } from "@/utils";
import WhatCoPackaged from "./layouts/WhatCoPackaged";
import SolvingCore from "./layouts/SolvingCore";
import WhyCpo from "./layouts/WhyCpo";

const CoPackagedOpticsPage = () => {
  return (
    <>
      <Header />

      <BaseBanner>
        <h1 className="text-black text-[36px] md:text-[50px] lg:text-[60px] xl:text-[84px] font-medium uppercase leading-tight futura-condensed-medium xl:tracking-[2px]">
          Metalens Technology Built {isMobile() ? null : <br />} for Co-Packaged
          Optics
        </h1>

        <p className="futura-medium mx-auto xl:text-[24px] lg:text-[20px] xl:leading-[1.5] text-black text-[16px] leading-[1.5] xl:max-w-[60%] lg:max-w-[80%] w-full xl:mt-8 mt-4">
          Ultra-compact, precision-engineered metalens components that solve the
          most critical optical challenges inside modern CPO packages, enabling
          tighter integration, higher bandwidth, and long-term reliability.
        </p>
      </BaseBanner>

      <div className="container xl:pb-[120px] !pb-[64px]">
        <WhatCoPackaged />
        <SolvingCore />
        <WhyCpo />
      </div>
      <Footer />
    </>
  );
};

export default CoPackagedOpticsPage;
