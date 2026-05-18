"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { getProductPath } from "@/utils/product";

const MobileProductCard = ({
  product,
  onTouch = () => {},
  productIdIsTouched,
}) => {
  const [lastTouchTime, setLastTouchTime] = useState(0);

  const handleTouch = (e) => {
    const currentTime = new Date().getTime();
    const timeDiff = currentTime - lastTouchTime;

    if (timeDiff < 300) {
      // Double touch detected (within 300ms) - let Link handle navigation
      // Don't prevent default, let the Link handle it
      return;
    } else {
      e.preventDefault();
      onTouch(product?.id);
    }
    setLastTouchTime(currentTime);
  };

  const positionMap = {
    "01": "left-[45%]",
    "02": "left-[45%]",
    "03": "left-[35%]",
    "04": "left-[45%]",
    "05": "left-[40%]",
  };

  const leftPosition = positionMap[product?.id] || "left-[45%]";

  return (
    <Link
      href={getProductPath(product?.slug)}
      className="block bg-[#ebebeb] px-4 py-5 relative h-[300px] overflow-hidden"
      onTouchStart={handleTouch}
    >
      <div className="flex flex-col justify-between h-full">
        <motion.div
          className="futura-condensed-medium text-[28px] text-[#d34c39]"
          layout
        >
          {product.id}
        </motion.div>

        <div>
          <div className="futura-condensed-medium text-[24px] max-w-[40%]">
            {product?.title}
          </div>

          <Image
            width="0"
            height="0"
            src="/next-orange.svg"
            alt="Next"
            className="w-[28px]"
          />

          <div className="flex justify-start mt-5">
            <motion.div
              initial={{ x: 200, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 200, opacity: 0 }}
              transition={{
                duration: 0.3,
                ease: [0.37, 0, 0.63, 1],
                delay: 0.3,
              }}
              className="bg-black text-white px-4 py-2 rounded-full xl:text-[20px] futura-condensed-medium border-[2px] border-transparent transition-all whitespace-nowrap cursor-pointer"
            >
              FIND OUT MORE
            </motion.div>
          </div>
        </div>
      </div>

      <Image
        src={`/${product?.image || "fallback-image.svg"}`}
        alt="Product"
        width="0"
        height={0}
        className={`rounded-lg h-[200px] w-auto object-contain absolute top-1/2 -translate-y-1/2 ${leftPosition} ${
          product?.objectPosition
            ? `object-${product.objectPosition}`
            : "object-center"
        }`}
        sizes="100vw"
      />
    </Link>
  );
};

export default MobileProductCard;
