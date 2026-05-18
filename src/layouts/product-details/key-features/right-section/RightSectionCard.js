"use client";

import Image from "next/image";
import clsx from "clsx";
import useMobile from "@/hooks/useMobile";

const RightSectionCard = ({ item }) => {
  const isMobile = useMobile();

  const removeAllBrTags = (html = "") => {
    if (isMobile) {
      return html.replace(/<br\s*\/?>/g, "");
    }
    return html;
  };

  const renderCardStyle = () => {
    if (!item.cardStyle) return {};

    const baseStyle = {};

    if (isMobile) {
      baseStyle.paddingLeft = item.cardStyle.paddingLeftMobile;
      baseStyle.paddingRight = item.cardStyle.paddingRightMobile;
      if (item.cardStyle.gapMobile) {
        baseStyle.gap = item.cardStyle.gapMobile;
      }
    } else {
      baseStyle.paddingLeft = item.cardStyle.paddingLeft;
      baseStyle.paddingRight = item.cardStyle.paddingRight;
      if (item.cardStyle.gap) {
        baseStyle.gap = item.cardStyle.gap;
      }
    }

    return baseStyle;
  };

  return (
    <div
      className={clsx(
        "rounded-[32px] bg-[#C73C29] px-6 lg:px-10 2xl:py-[80px] xl:py-[60px] lg:py-[40px] py-10 flex lg:flex-row flex-col w-full lg:justify-start justify-center items-center gap-6 lg:gap-10"
      )}
      style={renderCardStyle()}
    >
      <div className="flex-shrink-0 flex justify-center lg:justify-start w-full lg:w-auto">
        <Image
          src={item.image}
          alt={item.title}
          width={0}
          height={0}
          sizes="100vw"
          className={clsx("2xl:w-[350px] xl:w-[300px] lg:w-[250px] w-full max-w-[220px] lg:max-w-none h-auto object-contain")}
          style={{
            maxWidth: isMobile ? "220px" : item.imageMaxWidth || "none",
          }}
        />
      </div>
      <div className="flex-1 w-full lg:w-auto">
        <div
          className={clsx(
            "flex gap-4 items-start",
            item.isTitleBelowSubtitle
              ? "flex-col items-start justify-start"
              : "flex-col-reverse items-start justify-end"
          )}
        >
          {item.subtitleDom && (
            <h2
              className="2xl:text-[32px] xl:text-[28px] lg:text-[22px] text-[20px] futura-bold text-white uppercase leading-tight opacity-80 lg:text-start text-center w-full"
              dangerouslySetInnerHTML={{
                __html: item.subtitleDom,
              }}
            ></h2>
          )}

          {item.titleImage && (
            <div className="w-full lg:w-auto flex lg:justify-start justify-center">
              <Image
                src={item.titleImage}
                alt={item.title}
                width={0}
                height={0}
                sizes="100vw"
                className="2xl:h-[50px] xl:h-[36px] lg:h-[30px] w-auto h-auto object-contain"
              />
            </div>
          )}

          {item.title && (
            <h2
              className="2xl:text-[36px] xl:text-[28px] lg:text-[24px] text-[22px] futura-bold text-white uppercase leading-tight lg:text-start text-center w-full"
              dangerouslySetInnerHTML={{
                __html: item.title,
              }}
            ></h2>
          )}
        </div>

        <div
          className={clsx(
            "futura-medium text-white 2xl:text-lg xl:text-base lg:text-[14px] text-[13px] opacity-80 lg:text-start text-center",
            !item.descriptionStyle && "lg:mt-8 mt-4"
          )}
          style={item.descriptionStyle}
          dangerouslySetInnerHTML={{
            __html: removeAllBrTags(item.description),
          }}
        ></div>
      </div>
    </div>
  );
};

export default RightSectionCard;
