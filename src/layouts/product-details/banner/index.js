import React from "react";
import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";
import BaseButton from "@/components/BaseButton";
import { removeAllBrTags } from "@/utils";
import "./index.scss";
import useMobile from "@/hooks/useMobile";

const countBrTag = (text) => {
  if (!text) return 0;
  // console.log(text, text.split("<br />").length);
  return text.split("<br />").length - 1;
};
const ProductDetailsBanner = ({ product }) => {
  const isMobile = useMobile();
  const isExternalLink = product?.buyNow?.toLowerCase().startsWith("http");
  return (
    <div className="relative w-full lg:min-h-[calc(100vh-100px)] bg-[#F0F0F0] pb-[60px]">
      <div
        className="absolute text-white xl:text-[200px] lg:text-[150px] text-[80px] xl:left-[-20px] left-0 xl:top-[-60px] lg:top-[-40px] top-0 futura-condensed-medium uppercase xl:tracking-[1rem] lg:tracking-[0.7rem] tracking-[0.5rem] w-full"
        dangerouslySetInnerHTML={{ __html: product?.nameDom }}
        style={{
          whiteSpace: "nowrap",
        }}
      ></div>

      <div className="relative">
        <div
          className={clsx(
            "relative w-full lg:h-[600px] xl:pb-[72px] pb-[24px]",
            countBrTag(product?.nameDom) > 1 ? "h-[400px]" : "h-[300px]"
          )}
        >
          <div
            className={clsx(
              "absolute 2xl:h-[450px] xl:h-[400px] lg:h-[350px] h-[400px] lg:w-auto w-[90%] z-[10]"
            )}
            style={{
              top: "45%",
              left: "50%",
              transform: `translate(-50%, -50%) ${
                isMobile
                  ? product?.mobileImageScale
                    ? `scale(${product?.mobileImageScale})`
                    : "scale(1)"
                  : product?.imageScale
                  ? `scale(${product?.imageScale})`
                  : "scale(1)"
              }`,
            }}
          >
            <Image
              width="0"
              height="0"
              sizes="100vw"
              src={product?.image}
              alt="Next"
              className="w-full h-full relative cursor-pointer hover:scale-105 transition-transform duration-300 object-contain"
            />
          </div>
        </div>

        <div className="flex flex-col items-center gap-5 relative z-30 xl:max-w-[70%] lg:max-w-[80%] max-w-[90%] mx-auto xl:mt-0 mt-3">
          {product?.bannerTag && (
            <span className="inline-flex items-center justify-center border border-black rounded-full px-8 py-1.5 futura-medium text-[#161616] text-[13px] xl:text-[14px] tracking-[1.5px] uppercase">
              {product.bannerTag}
            </span>
          )}

          <div className="xl:text-[60px] lg:text-[48px] text-[48px] font-medium leading-tight lg:leading-normal text-[#d34c39] uppercase text-center futura-condensed-medium w-full">
            {product?.name}
          </div>
        </div>

        <div className="xl:text-[28px] lg:text-[24px] text-[20px] futura-medium text-center xl:max-w-[70%] lg:max-w-[80%] mx-auto max-w-[90%]">
          {product?.details?.subtitle}
        </div>

        {product?.details?.description && (
          <div
            className="xl:text-[20px] lg:text-[18px] text-[16px] text-center xl:max-w-[60%] lg:max-w-[75%] max-w-[90%] mx-auto mt-5"
            dangerouslySetInnerHTML={{
              __html: removeAllBrTags(product?.details?.description),
            }}
          ></div>
        )}

        {product?.details?.descriptionHTML && (
          <div className="xl:text-[20px] lg:text-[18px] text-[16px] xl:max-w-[60%] lg:max-w-[75%] max-w-[90%] mx-auto mt-10 space-y-8">
            {product.details.descriptionHTML.map((item, index) => (
              <div key={index} className="flex flex-col gap-2">
                <h3 className="font-bold text-[#d34c39] uppercase xl:text-[24px] text-[20px]">
                  {item.title}
                </h3>
                <div
                  className="prose prose-lg max-w-none text-[rgb(17,17,17)]"
                  dangerouslySetInnerHTML={{ __html: item.html }}
                />
              </div>
            ))}
          </div>
        )}

        {product?.details?.subtitleItems && (
          <div className="xl:text-[20px] lg:text-[18px] text-[16px] text-center xl:max-w-[60%] lg:max-w-[75%] max-w-[90%] mx-auto mt-5">
            <ul class="mt-0 space-y-2 text-center text-[rgb(17,17,17)] list-disc list-inside">
              {product?.details?.subtitleItems.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex flex-col mx-auto gap-5 w-80">
          {product?.buyNow && (
            isExternalLink ? (
              <a
                href={product.buyNow}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <BaseButton
                  label={product?.buyNowText || "BUY"}
                  className="!mb-0 !w-full"
                  classNameBtn="!w-full uppercase"
                />
              </a>
            ) : (
              <Link href={product.buyNow}>
                <BaseButton
                  label={product?.buyNowText || "BUY"}
                  className="!mb-0 !w-full"
                  classNameBtn="!w-full uppercase"
                />
              </Link>
            )
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
