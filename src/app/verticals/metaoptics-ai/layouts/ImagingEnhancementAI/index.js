import Image from "next/image";

const ImagingEnhancementAI = () => {
  return (
    <div className="xl:pt-[80px] pt-[40px]">
      {/* Imaging Enhancement AI Header */}
      <div className="flex items-center mb-8 xl:mb-12">
        <div className="bg-[#d34c39] text-white px-5 py-2 xl:text-[40px] text-[24px] uppercase futura-condensed-medium tracking-wide rounded-md">
          IMAGING ENHANCEMENT AI
        </div>
        <div className="flex-grow h-[1px] bg-[#e3e3e3]"></div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 xl:gap-20">
        {/* Left Content */}
        <div className="xl:col-span-7 flex flex-col gap-10">
          <div>
            <h3 className="futura-bold text-[18px] xl:text-[24px] text-black">
              Sharper, Brighter, Smarter Output
            </h3>
            <div className="flex flex-col gap-5 mt-4">
              <p className="futura-medium text-[16px] xl:text-xl text-[#676767]">
                MetaOptics Imaging Enhancement AI post-processes optical data
                captured through our metalens systems, correcting and elevating
                image quality in ways that downstream hardware alone cannot
                achieve.
              </p>
              <p className="futura-medium text-[16px] xl:text-xl text-[#676767]">
                Developed in partnership with a Taiwanese AI and machine
                learning company, our algorithms run on Nvidia GPU
                infrastructure and are designed for high-throughput, real-time
                enhancement pipelines.
              </p>
            </div>

            <ul className="list-disc pl-5 mt-8 flex flex-col gap-5">
              <li className="futura-medium text-[16px] xl:text-[20px] text-[#111111]">
                <span className="futura-bold">AI Sharpening Algorithm:</span>{" "}
                upscales and restores low-resolution captures to near
                high-resolution fidelity
              </li>
              <li className="futura-medium text-[16px] xl:text-[20px] text-[#111111]">
                <span className="futura-bold">Brightness Algorithm:</span>{" "}
                intelligently tunes exposure and dynamic range for low-light and
                high-contrast scenes
              </li>
              <li className="futura-medium text-[16px] xl:text-[20px] text-[#111111]">
                Customized and enhanced color sharpening optimised for IoT
                camera output
              </li>
              <li className="futura-medium text-[16px] xl:text-[20px] text-[#111111]">
                Nvidia GPU-accelerated processing for real-time deployment
              </li>
            </ul>
          </div>
        </div>

        {/* Right Images (ai-3, ai-4) */}
        <div className="xl:col-span-5 flex flex-col items-center justify-center gap-6">
          <div className="flex flex-col text-center w-full">
            <Image
              src="/metaoptics-ai/ai-3.png"
              alt="Original Image"
              width={0}
              height={0}
              sizes="100vw"
              className="w-full h-auto object-contain rounded-[8px]"
              unoptimized
            />
            <span className="futura-medium text-[13px] xl:text-[14px] text-[#676767] mt-3 block italic">
              Original Image
            </span>
          </div>

          <div className="flex flex-col text-center w-full">
            <Image
              src="/metaoptics-ai/ai-4.png"
              alt="Tuned Image"
              width={0}
              height={0}
              sizes="100vw"
              className="w-full h-auto object-contain rounded-[8px]"
              unoptimized
            />
            <span className="futura-medium text-[13px] xl:text-[14px] text-[#676767] mt-3 block italic">
              Tuned Image
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Images (ai-5, ai-6, ai-7) */}
      <div className="flex flex-col md:flex-row w-full items-start xl:h-[576px] h-auto mt-12 gap-6">
        <div className="flex flex-col text-center w-full flex-1 md:mr-[140px] relative mb-[100px] md:mb-0">
          <div className="w-full">
            <Image
              src="/metaoptics-ai/ai-5.png"
              alt="Taken Low Resolution Image"
              width={0}
              height={0}
              sizes="100vw"
              className="w-full h-auto object-cover rounded-[8px]"
              unoptimized
            />
          </div>
          <span className="futura-medium text-[13px] xl:text-[14px] text-[#676767] mt-3 block italic">
            Taken Low Resolution Image
          </span>

          {/* Arrow */}
          <div className="flex absolute md:top-1/2 top-[calc(100%+40px)] md:right-[-105px] right-1/2 transform md:-translate-y-1/2 translate-y-0 md:translate-x-1/2 translate-x-1/2 z-10 w-14 md:w-10 xl:w-[74px] rotate-90 md:rotate-0">
            <Image
              src="/metaoptics-ai/arrow.png"
              alt="Arrow"
              width={0}
              height={0}
              sizes="100vw"
              className="w-full h-auto object-contain"
              unoptimized
            />
          </div>
        </div>

        <div className="flex flex-col text-center w-full flex-1 md:mr-[32px]">
          <Image
            src="/metaoptics-ai/ai-6.png"
            alt="Image Processed By Our Algorithm"
            width={0}
            height={0}
            sizes="100vw"
            className="w-full h-auto object-cover rounded-[8px]"
            unoptimized
          />
          <span className="futura-medium text-[13px] xl:text-[14px] text-[#676767] mt-3 block italic">
            Image Processed By Our Algorithm
          </span>
        </div>

        <div className="flex flex-col text-center w-full flex-1">
          <Image
            src="/metaoptics-ai/ai-7.png"
            alt="Original High-Res Image"
            width={0}
            height={0}
            sizes="100vw"
            className="w-full h-auto object-cover rounded-[8px]"
            unoptimized
          />
          <span className="futura-medium text-[13px] xl:text-[14px] text-[#676767] mt-3 block italic">
            Original High-Res Image
          </span>
        </div>
      </div>
    </div>
  );
};

export default ImagingEnhancementAI;
