"use client";

import React from "react";
import Image from "next/image";

const BaseBanner = ({ title }) => {
  return (
    <section className="relative w-full h-[300px] md:h-[450px] xl:h-[615px] flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/common/banner.png"
          alt="Banner Background"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <h1 className="text-black text-center text-[48px] md:text-[72px] xl:text-[128px] font-medium uppercase leading-tight futura-condensed-medium xl:tracking-[2px]">
          {title}
        </h1>
      </div>
    </section>
  );
};

export default BaseBanner;
