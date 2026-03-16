"use client";

import React from "react";
import Image from "next/image";

const BaseBanner = ({ title, children }) => {
  return (
    <section className="relative w-full h-[300px] md:h-[450px] xl:h-[615px] flex items-center overflow-hidden xl:px-0 px-5">
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
      <div className="relative z-10 text-center w-full">
        {title && (
          <h1 className="text-black text-center text-[48px] md:text-[72px] xl:text-[128px] font-medium uppercase leading-tight futura-condensed-medium xl:tracking-[2px]">
            {title}
          </h1>
        )}

        {children}
      </div>
    </section>
  );
};

export default BaseBanner;
