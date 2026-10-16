import Image from "next/image";

const SharpeningImaging = () => {
  return (
    <div className="xl:pt-[80px] pt-[40px]">
      {/* Imaging Enhancement AI Header */}
      <div className="flex items-center mb-8 xl:mb-12">
      <div className="bg-[#d34c39] text-white px-[16px] py-[8px] xl:px-[32px] xl:py-[16px] text-[30px] xl:text-[40px] uppercase futura-condensed-medium tracking-wide rounded-md flex items-center gap-3">
          <Image
            src="/metaoptics-ai/sharpening-imaging.svg"
            alt="Sharpening Imaging"
            width={40}
            height={40}
            className="hidden xl:block w-[40px] h-[40px] object-contain"
            unoptimized
          />
        Sharpening Imaging
        </div>
        <div className="flex-grow h-[1px] bg-[#e3e3e3]"></div>
      </div>

      <div className="flex flex-col gap-10">
      <div>          
        <div className="flex flex-col gap-5 mt-4">
          <p className="futura-medium text-[16px] xl:text-xl text-[#676767]">
          MetaOptics' sharpening imaging module uses deep learning-based deconvolution to restore image clarity in metalens camera output. 
          Metalens optics can introduce wavelength-dependent aberrations — chromatic blur, coma, astigmatism — that reduce sharpness, especially toward the edges of the field of view. 
          A neural network trained on metalens-specific image data reverses these optical degradations in a single inference pass, 
          delivering sharper images with improved contrast across the full field. This effectively extends the useful performance envelope of the metalens design. 
          The underlying technology is patent-pending and received the AAAI 2026 Best Demo Award.
          </p>            
        </div>
      </div>      
    </div>
     

      {/* Bottom Images (ai-5, ai-6, ai-7) */}
      <div className="flex flex-col md:flex-row w-full items-start h-auto mt-12 gap-6">
        <div className="flex flex-col text-center w-full flex-1 md:mr-[140px] relative mb-[100px] md:mb-0">
          <div className="w-full">
            <Image
              src="/metaoptics-ai/sharpening-imaging-01.jpg"
              alt="Basic"
              width={0}
              height={0}
              sizes="100vw"
              className="w-full h-auto object-cover rounded-[8px]"
              unoptimized
            />
          </div>
          <span className="futura-medium text-[13px] xl:text-[14px] text-[#676767] mt-3 block italic">
          Basic
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
            src="/metaoptics-ai/sharpening-imaging-02.jpg"
            alt="AI Enhanced"
            width={0}
            height={0}
            sizes="100vw"
            className="w-full h-auto object-cover rounded-[8px]"
            unoptimized
          />
          <span className="futura-medium text-[13px] xl:text-[14px] text-[#676767] mt-3 block italic">
          AI Enhanced
          </span>
        </div>        
      </div>
    </div>
);
};

export default SharpeningImaging;
