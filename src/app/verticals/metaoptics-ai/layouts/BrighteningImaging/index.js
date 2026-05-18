import Image from "next/image";

const BrighteningImaging = () => {
  return (
      <div className="xl:pt-[80px] pt-[40px]">
        {/* Imaging Enhancement AI Header */}
        <div className="flex items-center mb-8 xl:mb-12">
        <div className="bg-[#d34c39] text-white px-5 py-2 xl:text-[40px] text-[24px] uppercase futura-condensed-medium tracking-wide rounded-md flex items-center gap-3">
          <Image
            src="/metaoptics-ai/brightening-imaging-ai.svg"
            alt="Brightening Imaging"
            width={40}
            height={40}
            className="w-[40px] h-[40px] object-contain"
            unoptimized
          />
            Brightening Imaging AI
          </div>
          <div className="flex-grow h-[1px] bg-[#e3e3e3]"></div>
        </div>
  
        <div className="flex flex-col gap-10">
        <div className="order-2 xl:order-1">          
          <div className="flex flex-col gap-5 mt-4">
            <p className="futura-medium text-[16px] xl:text-xl text-[#676767]">
            MetaOptics' brightening imaging module uses a trained neural network to enhance brightness, contrast, 
            and visibility in images captured under challenging lighting conditions. Unlike conventional brightness adjustments that uniformly scale pixel values and amplify noise, 
            this AI-driven approach selectively recovers detail in dark regions while preserving highlights and suppressing noise. This is particularly valuable for compact metalens cameras, 
            where the thin, flat optical design constrains aperture size and light collection.
            </p>            
          </div>
        </div>

        {/* Image Flow */}
        <div className="flex flex-col md:flex-row w-full items-start h-auto gap-6 order-1 xl:order-2">
          <div className="flex flex-col text-center w-full flex-1 md:mr-[140px] relative md:mb-0">
            <div className="w-full">
              <Image
                src="/metaoptics-ai/ai-3.png"
                alt="Original Image"
                width={0}
                height={0}
                sizes="100vw"
                className="w-full h-auto object-cover rounded-[8px]"
                unoptimized
              />
            </div>   
            <span className="futura-medium text-[13px] xl:text-[14px] text-[#676767] mt-3 block italic">
                Original Image
              </span>                    
          </div>

          <div className="flex flex-col text-center w-full flex-1 md:mr-[32px]">
            <Image
              src="/metaoptics-ai/ai-4.png"
              alt="Tuned Image"
              width={0}
              height={0}
              sizes="100vw"
              className="w-full h-auto object-cover rounded-[8px]"
              unoptimized
            />           
            <span className="futura-medium text-[13px] xl:text-[14px] text-[#676767] mt-3 block italic">
                Tuned Image
              </span>
          </div>      
             
        </div>
      </div>
       
  
        {/* Bottom Images (ai-5, ai-6, ai-7) */}
        <div className="flex flex-col md:flex-row w-full items-start h-auto mt-12 gap-6 order-3 xl:order-3">
          <div className="flex flex-col text-center w-full flex-1 md:mr-[140px] relative mb-[100px] md:mb-0">
            <div className="w-full">
              <Image
                src="/metaoptics-ai/ai-5.jpg"
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
              src="/metaoptics-ai/ai-6.jpg"
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
              src="/metaoptics-ai/ai-7.jpg"
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

export default BrighteningImaging;

