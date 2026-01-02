"use client";

import { useState } from "react";
import clsx from "clsx";
import BaseButton from "@/components/BaseButton";

const handleOnDownloadBrochure = (brochure) => {
  if (brochure.toLowerCase().startsWith("http")) {
    window.location.href = brochure;
  } else {
    router.push(brochure);
  }
};

const ProductDetailsKeyFeaturesLeftSection = ({ leftSection }) => {
  const { title, description, list, brochure } = leftSection;
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="flex xl:sticky xl:top-0 xl:self-start">
      <div className="flex-1">
        {/* Main Title */}
        {title && (
          <h1 className="xl:text-[28px] text-[26px] font-medium text-black mb-6 leading-tight futura-medium">
            {title}
          </h1>
        )}

        {/* Description Paragraph */}
        {description && (
          <p className="xl:text-[18px] text-[16px] text-black mb-8 leading-relaxed text-justify">
            {description}
          </p>
        )}

        {/* KEY FEATURES Section */}
        <div className={clsx(title && "xl:mt-16")}>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center justify-between gap-4 group w-full border-b-2 border-[#313131] pb-3 "
          >
            <h2 className="xl:text-[48px] text-[44px] font-medium text-black futura-condensed-medium">
              KEY FEATURES
            </h2>
            {/* Red circular icon with chevron */}
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

          {/* Bulleted List */}
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
          <div className="flex flex-col gap-5 w-80 mx-auto xl:mx-0">
            {brochure && (
              <BaseButton
                label="Download Brochure"
                onClick={handleOnDownloadBrochure}
                className="!mb-0 !w-full"
                classNameBtn="!w-full uppercase"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsKeyFeaturesLeftSection;
