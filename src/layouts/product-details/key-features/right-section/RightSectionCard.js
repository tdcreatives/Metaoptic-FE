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
        "rounded-[32px] bg-[#C73C29] px-10 xl:py-[100px] py-10 flex xl:flex-row flex-col w-full xl:justify-start justify-center items-center"
      )}
      style={renderCardStyle()}
    >
      <Image
        src={item.image}
        alt={item.title}
        width={0}
        height={0}
        sizes="100vw"
        className={clsx("xl:w-[450px] w-full h-auto object-cover")}
        style={{
          maxWidth: isMobile ? "220px" : item.imageMaxWidth || "450px",
        }}
      />
      <div>
        <div
          className={clsx(
            "flex gap-4 items-start",
            item.isTitleBelowSubtitle
              ? "flex-col items-start justify-start"
              : "flex-col-reverse items-start justify-end"
          )}
        >
          <h2
            className="xl:text-[32px] text-[24px] futura-bold text-white uppercase leading-[38px] opacity-80 xl:text-start text-center whitespace-nowrap w-full"
            dangerouslySetInnerHTML={{
              __html: item.subtitleDom,
            }}
          ></h2>

          {item.titleImage && (
            <Image
              src={item.titleImage}
              alt={item.title}
              width={0}
              height={0}
              sizes="100vw"
              className="xl:h-[50px] xl:w-auto w-full h-auto object-cover"
            />
          )}

          {item.title && (
            <h2
              className="xl:text-[40px] text-[24px] futura-bold text-white uppercase xl:leading-[50px] leading-[38px] whitespace-nowrap xl:text-start text-center w-full"
              dangerouslySetInnerHTML={{
                __html: item.title,
              }}
            ></h2>
          )}
        </div>

        <div
          className={clsx(
            "futura-medium text-white xl:text-lg opacity-80 capitalize xl:text-start text-center",
            !item.descriptionStyle && "xl:mt-[40px] mt-6"
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
