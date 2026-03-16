import Image from "next/image";

const MotViewer = () => {
  return (
    <div className="xl:pt-[80px] pt-[40px]">
      {/* MotViewer Header */}
      <div className="flex items-center mb-8 xl:mb-12">
        <div className="bg-[#d34c39] text-white px-5 py-2 xl:text-[40px] text-[24px] uppercase futura-condensed-medium tracking-wide rounded-md">
          METAOPTICS MOTVIEWER
        </div>
        <div className="flex-grow h-[1px] bg-[#e3e3e3]"></div>
      </div>

      <div className="flex flex-col gap-10">
        <div>
          <h3 className="futura-bold text-[18px] xl:text-[24px] text-black">
            Image Processing Development Software
          </h3>
          <p className="futura-medium text-[16px] xl:text-xl text-[#676767] mt-4 xl:max-w-[90%]">
            MOTviewer is MetaOptics' proprietary image processing platform,
            built to work directly with our metalens camera systems. It provides
            developers and researchers with a configurable environment to
            acquire, process, and export optical data — with AI integration
            built in from the ground up.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 xl:gap-20">
          {/* Left Content */}
          <div className="xl:col-span-6 flex flex-col gap-8 justify-center">
            <div className="flex flex-col gap-8">
              <div className="flex items-start gap-4">
                <div className="w-[6px] h-[6px] rounded-full bg-[#d34c39] mt-[10px] flex-shrink-0"></div>
                <div>
                  <h4 className="futura-medium text-[18px] xl:text-[20px] text-[#d34c39]">
                    Variable Processing Pipeline
                  </h4>
                  <p className="futura-medium text-[16px] xl:text-[18px] text-[#676767] mt-2">
                    Variable stacking of image post-processing nodes, giving
                    developers full control over how raw optical data is handled
                    and refined.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-[6px] h-[6px] rounded-full bg-[#d34c39] mt-[10px] flex-shrink-0"></div>
                <div>
                  <h4 className="futura-medium text-[18px] xl:text-[20px] text-[#d34c39]">
                    Automated Dataset Acquisition
                  </h4>
                  <p className="futura-medium text-[16px] xl:text-[18px] text-[#676767] mt-2">
                    Automated image dataset acquisition built for AI training
                    workflows, reducing the manual overhead of collecting
                    labeled optical data at scale.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-[6px] h-[6px] rounded-full bg-[#d34c39] mt-[10px] flex-shrink-0"></div>
                <div>
                  <h4 className="futura-medium text-[18px] xl:text-[20px] text-[#d34c39]">
                    Plugin Architecture
                  </h4>
                  <p className="futura-medium text-[16px] xl:text-[18px] text-[#676767] mt-2">
                    Plugin system for external image processing nodes, enabling
                    seamless integration with third-party AI models and custom
                    processing modules.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="xl:col-span-6 flex items-center justify-center">
            <Image
              src="/metaoptics-ai/ai-8.png"
              alt="MotViewer Software"
              width={0}
              height={0}
              sizes="100vw"
              className="w-full h-auto object-contain rounded-[8px]"
              unoptimized
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MotViewer;
