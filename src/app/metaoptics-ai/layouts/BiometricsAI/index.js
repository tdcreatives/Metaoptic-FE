import Image from "next/image";

const BiometricsAI = () => {
  return (
    <div className="xl:pt-[80px] pt-[40px]">
      {/* 3D Biometrics AI Header */}
      <div className="flex items-center mb-8 xl:mb-12">
        <div className="bg-[#d34c39] text-white px-5 py-2 xl:text-[40px] text-[24px] uppercase futura-condensed-medium tracking-wide rounded-md">
          3D BIOMETRICS AI
        </div>
        <div className="flex-grow h-[1px] bg-[#e3e3e3]"></div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 xl:gap-20">
        {/* Left Content */}
        <div className="xl:col-span-7 flex flex-col gap-10">
          <div>
            <h3 className="futura-bold text-[18px] xl:text-[24px] text-black">
              Identity Verification at the Nanoscale
            </h3>
            <div className="flex flex-col gap-5 mt-4">
              <p className="futura-medium text-[16px] xl:text-xl text-[#676767]">
                MetaOptics' 3D Biometrics AI pairs the precision of metalens
                optics with deep learning models to deliver biometric
                identification that is faster, more compact, and more reliable
                than conventional sensor systems.
              </p>
              <p className="futura-medium text-[16px] xl:text-xl text-[#676767]">
                By capturing fine structural detail at a level that traditional
                camera lenses cannot resolve, our system delivers high-
                confidence identity verification in a form factor small enough
                to embed in everyday devices.
              </p>
            </div>
            
            <ul className="list-disc pl-5 mt-8 flex flex-col gap-5">
              <li className="futura-medium text-[16px] xl:text-[20px] text-[#111111]">
                Fingerprint recognition powered by metalens-grade optical
                resolution
              </li>
              <li className="futura-medium text-[16px] xl:text-[20px] text-[#111111]">
                3D depth sensing for accurate, liveness-aware facial and
                biometric capture
              </li>
              <li className="futura-medium text-[16px] xl:text-[20px] text-[#111111]">
                Compact sensor integration suited to IoT devices, access
                control, and mobile platforms
              </li>
            </ul>
          </div>
        </div>

        {/* Right Image */}
        <div className="xl:col-span-5 flex items-center justify-center">
          <Image
            src="/metaoptics-ai/ai-1.png"
            alt="3D Biometrics AI"
            width={0}
            height={0}
            sizes="100vw"
            className="w-full max-w-[500px] h-auto object-contain"
            unoptimized
          />
        </div>
      </div>
    </div>
  );
};

export default BiometricsAI;
