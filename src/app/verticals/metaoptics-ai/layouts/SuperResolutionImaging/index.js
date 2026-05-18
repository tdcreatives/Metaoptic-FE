import Image from "next/image";

const SuperResolutionImaging = () => {
  return (
    <div className="xl:pt-[80px] pt-[40px]">
      {/* Super-Resolution Imaging Header */}
      <div className="flex items-center mb-8 xl:mb-12">
      <div className="bg-[#d34c39] text-white px-5 py-2 xl:text-[40px] text-[24px] uppercase futura-condensed-medium tracking-wide rounded-md flex items-center gap-3">
          <Image
            src="/metaoptics-ai/super-resolution-imaging.svg"
            alt="Super-Resolution Imaging"
            width={40}
            height={40}
            className="w-[40px] h-[40px] object-contain"
            unoptimized
          />
          SUPER-RESOLUTION IMAGING
        </div>
        <div className="flex-grow h-[1px] bg-[#e3e3e3]"></div>
      </div>

      <div className="flex flex-col gap-10">
        {/* On mobile: show images first, then text. On desktop (>= md): keep original order. */}
        <div className="order-2 md:order-1">
          <div className="flex flex-col gap-5 mt-4">
            <p className="futura-medium text-[16px] xl:text-xl text-[#676767]">
            MetaOptics' super-resolution module uses deep learning to upscale images captured by metalens cameras, recovering fine detail that conventional interpolation methods cannot reproduce. Trained specifically on metalens optical data, the algorithm reconstructs spatial information beyond the sensor's native resolution — delivering 2× to 4× upscaling with sharp, faithful results. This enables higher-resolution imaging from compact, low-cost metalens camera modules without increasing sensor size.
            Fingerprint recognition powered by metalens-grade optical resolution
            3D depth sensing for accurate, liveness-aware facial and biometric capture
              Compact sensor integration suited to IoT devices, access control, and mobile platforms
            </p>            
          </div>
        </div>

        {/* Image Flow */}
        <div className="order-1 md:order-2 flex flex-col md:flex-row w-full items-start xl:h-[576px] h-auto gap-6">
          <div className="flex flex-col text-center w-full flex-1 md:mr-[140px] relative mb-[100px] md:mb-0">
            <div className="w-full">
              <Image
                src="/metaoptics-ai/super-resolution-imaging-01.png"
                alt="Taken Low Resolution Image"
                width={0}
                height={0}
                sizes="100vw"
                className="w-full h-auto object-cover rounded-[8px]"
                unoptimized
              />
            </div>                       
          </div>

          <div className="flex flex-col text-center w-full flex-1 md:mr-[32px]">
            <Image
              src="/metaoptics-ai/super-resolution-imaging-02.png"
              alt="Image Processed By Our Algorithm"
              width={0}
              height={0}
              sizes="100vw"
              className="w-full h-auto object-cover rounded-[8px]"
              unoptimized
            />           
          </div>         
        </div>
      </div>
    </div>
  );
};

export default SuperResolutionImaging;

