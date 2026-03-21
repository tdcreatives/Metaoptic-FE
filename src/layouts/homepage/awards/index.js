"use client";

import React, { useRef, useState, useEffect } from "react";
import BaseTitle from "@/components/BaseTitle";
import Image from "next/image";
import { IconChevronLeft, IconChevronRight, IconX } from "@tabler/icons-react";
import awardsData from "@/constants/awards.json";

const Awards = () => {
  const scrollContainerRef = useRef(null);
  const [selectedAwardIndex, setSelectedAwardIndex] = useState(null);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = window.innerWidth < 768 ? 260 : 340;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setSelectedAwardIndex(null);
      }
    };

    if (selectedAwardIndex !== null) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedAwardIndex]);

  const handleNextModal = (e) => {
    e.stopPropagation();
    setSelectedAwardIndex((prev) => (prev + 1) % awardsData.length);
  };

  const handlePrevModal = (e) => {
    e.stopPropagation();
    setSelectedAwardIndex(
      (prev) => (prev - 1 + awardsData.length) % awardsData.length,
    );
  };

  return (
    <section className="xl:py-[32px] py-[24px] bg-white border-t border-[#C2C2C2]">
      <style>{`
                .hide-scroll-bar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scroll-bar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .award-modal-content p, 
                .award-modal-content span, 
                .award-modal-content li,
                .award-modal-content strong {
                    font-size: 16px !important;
                }
                @media (min-width: 768px) {
                    .award-modal-content p, 
                    .award-modal-content span, 
                    .award-modal-content li,
                    .award-modal-content strong {
                        font-size: 20px !important;
                    }
                }
            `}</style>

      <BaseTitle
        title="AWARDS"
        className="futura-condensed-medium !text-center"
      />

      <div className="relative max-w-[1360px] mx-auto px-12 md:px-16 mt-8 mb-8">
        <button
          onClick={() => scroll("left")}
          className="absolute left-[-10px] md:left-[-30px] top-[120px] md:top-[140px] -translate-y-1/2 z-10 p-2 text-[#E85B43]"
        >
          <IconChevronLeft size={44} stroke={2.5} />
        </button>

        <div
          ref={scrollContainerRef}
          className="flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory hide-scroll-bar"
        >
          {awardsData.map((award, index) => (
            <div
              key={award.id}
              onClick={() => setSelectedAwardIndex(index)}
              className="min-w-[240px] max-w-[240px] md:min-w-[280px] md:max-w-[280px] shrink-0 snap-center cursor-pointer group flex flex-col items-center"
            >
              <div className="w-full aspect-square bg-[#f0f0f0] flex items-center justify-center p-6">
                <div className="relative w-full h-[70%]">
                  <Image
                    src={award.image}
                    alt={award.title}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
              <div className="mt-6 text-center px-2">
                <h3 className="font-bold text-[22px] md:text-[28px] text-[#2a2a2a] leading-tight">
                  {award.title}
                </h3>
                <p className="text-[14px] md:text-[16px] text-[#2a2a2a] mt-2">
                  {award.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => scroll("right")}
          className="absolute right-[-10px] md:right-[-30px] top-[120px] md:top-[140px] -translate-y-1/2 z-10 p-2 text-[#E85B43]"
        >
          <IconChevronRight size={44} stroke={2.5} />
        </button>
      </div>

      {selectedAwardIndex !== null && (
        <div
          className="fixed inset-0 z-[9999] bg-black/60 flex items-center justify-center p-4 md:p-8"
          onClick={() => setSelectedAwardIndex(null)}
        >
          <div
            className="bg-white w-full max-w-[960px] h-full max-h-[90vh] flex flex-col relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 md:px-12 md:pt-20 pt-8 pb-4 flex items-center justify-center relative border-b border-[#e5e5e5] mx-4 md:mx-8 shrink-0">
              <h2
                className="futura-condensed-medium text-[#E85B43] text-center text-[28px] md:text-[48px] uppercase tracking-wide leading-tight"
                dangerouslySetInnerHTML={{
                  __html: awardsData[selectedAwardIndex].modalTitle,
                }}
              />
              <button
                onClick={() => setSelectedAwardIndex(null)}
                className="absolute right-0 top-10 -translate-y-1/2 text-[#E85B43]"
              >
                <IconX size={28} stroke={2.5} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto p-6 md:p-12 grow">
              {/* Inner Header/Image Area */}
              <div className="w-full max-w-[600px] mx-auto bg-[#f0f0f0] flex items-center justify-center py-12 px-8 relative mb-12">
                <button
                  onClick={handlePrevModal}
                  className="absolute left-[-20px] md:left-[-60px] top-1/2 -translate-y-1/2 text-[#E85B43] z-10"
                >
                  <IconChevronLeft size={44} stroke={2.5} />
                </button>

                <div className="relative w-[50%] md:w-[60%] aspect-square max-h-[250px]">
                  <Image
                    src={awardsData[selectedAwardIndex].image}
                    alt={awardsData[selectedAwardIndex].title}
                    fill
                    className="object-contain"
                  />
                </div>

                <button
                  onClick={handleNextModal}
                  className="absolute right-[-20px] md:right-[-60px] top-1/2 -translate-y-1/2 text-[#E85B43] z-10"
                >
                  <IconChevronRight size={44} stroke={2.5} />
                </button>
              </div>

              {/* HTML Content */}
              <div
                className="text-left max-w-[840px] mx-auto award-modal-content"
                dangerouslySetInnerHTML={{
                  __html: awardsData[selectedAwardIndex].htmlContent,
                }}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Awards;
