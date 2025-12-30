import React from "react";

import Image from "next/image";
import clsx from "clsx";
import BaseButton from "@/components/BaseButton";
import { removeAllBrTags } from "@/utils";
import "./index.scss";
import useMobile from "@/hooks/useMobile";
const ProductDetailsBanner = ({ product }) => {
  const handleOnBuyNow = () => {
    window.location.href = product?.buyNow;
  };
  const isMobile = useMobile();
  return (
    <div className="relative w-full xl:min-h-[calc(100vh-100px)] bg-[#F0F0F0] pb-[60px]">
      <div
        className="absolute text-white xl:text-[200px] text-[100px] xl:left-[-20px] left-0 xl:top-[-60px] top-0 futura-condensed-medium uppercase tracking-[1rem] w-full"
        dangerouslySetInnerHTML={{ __html: product?.nameDom }}
        style={{
          whiteSpace: "nowrap",
        }}
      ></div>

      <div className="relative z-100">
        <div className="w-full flex justify-center xl:h-[600px] h-fit pb-[72px] min-h-[400px]">
          <div
            className={clsx("xl:h-[450px] xl:w-auto w-[90%]")}
            style={{
              transform: isMobile
                ? "scale(1)"
                : product?.imageScale
                ? `scale(${product?.imageScale})`
                : "scale(1)",
            }}
          >
            <Image
              width="0"
              height="0"
              rmov
              sizes="100vw"
              src={product?.image}
              alt="Next"
              className="w-full h-full relative z-100 mx-auto cursor-pointer hover:scale-105 transition-transform duration-300 object-contain"
            />
          </div>
        </div>

        <div className="xl:text-[60px] text-[36px] text-[#d34c39] uppercase text-center relative z-30 futura-condensed-medium xl:max-w-[70%] max-w-[90%] mx-auto xl:mt-0 mt-3">
          {product?.name}
        </div>

        <div className="xl:text-[28px] text-[20px] futura-medium text-center xl:max-w-[70%] mx-auto max-w-[90%]">
          {product?.details?.subtitle}
        </div>

        {product?.details?.description && (
          <div
            className="xl:text-[20px] text-[16px] text-center xl:max-w-[60%] max-w-[90%] mx-auto mt-5"
            dangerouslySetInnerHTML={{
              __html: removeAllBrTags(product?.details?.description),
            }}
          ></div>
        )}

        {product?.details?.subtitleItems && (
          <div className="xl:text-[20px] text-[16px] text-center xl:max-w-[60%] max-w-[90%] mx-auto mt-5">
            <ul class="mt-0 space-y-2 text-center text-[rgb(17,17,17)] list-disc list-inside">
              {product?.details?.subtitleItems.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex flex-col mx-auto gap-5 w-80">
          {product?.buyNow && (
            <BaseButton
              label={product?.buyNowText || "BUY"}
              onClick={handleOnBuyNow}
              className="!mb-0 !w-full"
              classNameBtn="!w-full uppercase"
            />
          )}

          {product?.userGuide && (
            <BaseButton
              label={product?.userGuide?.name}
              classNameBtn="!text-[#d34c39] md:group-hover:!text-white uppercase !w-full"
              bgDefault="#fff"
              className="!mb-0 !w-full"
              onClick={() => {
                if (product?.userGuide?.link.toLowerCase().endsWith(".pdf")) {
                  const link = document.createElement("a");
                  link.href = product?.userGuide?.link;
                  link.download = product?.userGuide?.name || "file";
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                } else {
                  window.open(product?.userGuide?.link, "_blank");
                }
              }}
            />
          )}

          {product?.installer &&
            (Array.isArray(product?.installer.link) ? (
              <div className="relative group w-full max-w-xs">
                <BaseButton
                  label={`${product?.installer?.name}`}
                  classNameBtn="!text-[#d34c39] md:group-hover:!text-white uppercase !w-full"
                  bgDefault="#fff"
                  className="!mb-0 !w-full !mt-0"
                />
                <div className="absolute top-full mt-0 w-full bg-white shadow-lg rounded-md z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out pointer-events-none group-hover:pointer-events-auto">
                  {product?.installer?.link.map((item, index) => (
                    <button
                      key={index}
                      className="block w-full text-left px-4 py-2 text-[#d34c39] hover:bg-gray-100"
                      onClick={() => {
                        if (item.link.toLowerCase().endsWith(".pdf")) {
                          const link = document.createElement("a");
                          link.href = item.link;
                          link.download = item?.name || `file-${index + 1}`;
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        } else {
                          window.open(item.link, "_blank");
                        }
                      }}
                    >
                      {item?.name || `Link ${index + 1}`}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <BaseButton
                label={product?.installer?.name}
                classNameBtn="!text-[#d34c39] md:group-hover:!text-white uppercase !w-full"
                bgDefault="#fff"
                className="!mb-0 !w-full"
                onClick={() => {
                  if (product?.installer?.link.toLowerCase().endsWith(".pdf")) {
                    const link = document.createElement("a");
                    link.href = product?.installer?.link;
                    link.download = product?.installer?.name || "file";
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  } else {
                    window.open(product?.installer?.link, "_blank");
                  }
                }}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsBanner;
