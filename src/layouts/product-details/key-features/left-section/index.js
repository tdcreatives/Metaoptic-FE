"use client";

import { useState } from "react";
import clsx from "clsx";
import DownloadIconButton from "@/components/DownloadIconButton";
import { toBrochureFileName } from "@/utils/product";

const ProductDetailsKeyFeaturesLeftSection = ({ leftSection, productName }) => {
  const { title, description, list, brochure, userGuide } = leftSection;
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="flex lg:sticky lg:top-[100px] lg:self-start">
      <div className="flex-1">
        {title && (
          <h1 className="xl:text-[28px] lg:text-[24px] text-[22px] font-medium text-black mb-6 leading-tight futura-medium">
            {title}
          </h1>
        )}

        {description && (
          <p className="xl:text-[18px] lg:text-[16px] text-[15px] text-black mb-8 leading-relaxed text-justify">
            {description}
          </p>
        )}

        <div className={clsx(title && "lg:mt-16 mt-8")}>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center justify-between gap-4 group w-full border-b-2 border-[#313131] pb-3 "
          >
            <h2 className="xl:text-[48px] lg:text-[40px] text-[32px] font-medium text-black futura-condensed-medium uppercase">
              KEY FEATURES
            </h2>
            <div className="w-8 h-8 rounded-full bg-[#d34c39] flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
              <svg
                className={`w-4 h-4 text-white transition-transform duration-300 ${
                  isExpanded ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </button>

          <div
            className={`overflow-hidden transition-all duration-500 xl:mt-10 mt-8 ${
              isExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <ul className="space-y-3 list-disc list-inside">
              {list?.map((item, index) => (
                <li
                  key={index}
                  className="2xl:text-[26px] xl:text-[22px] text-[18px] futura-medium font-medium"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {(brochure || userGuide) && (
            <div className="flex flex-wrap gap-6 mt-8 justify-center xl:justify-start">
              {brochure && (
                <DownloadIconButton
                  label="Brochure"
                  href={brochure}
                  download={toBrochureFileName(productName)}
                />
              )}
              {userGuide && (
                <DownloadIconButton
                  label={userGuide.name || "User guide"}
                  href={userGuide.link}
                  download={userGuide.name || "user-guide"}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsKeyFeaturesLeftSection;
