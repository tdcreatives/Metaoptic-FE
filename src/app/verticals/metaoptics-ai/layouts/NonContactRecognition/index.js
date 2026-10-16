import Image from "next/image";

const NonContactRecognition = () => {
  return (
    <div className="xl:pt-[80px] pt-[40px]">
      {/* 3D Biometrics AI Header */}
      <div className="flex items-center mb-8 xl:mb-12">
        <div className="bg-[#d34c39] text-white px-[16px] py-[8px] xl:px-[32px] xl:py-[16px] text-[30px] xl:text-[40px] uppercase futura-condensed-medium tracking-wide rounded-md flex items-center gap-3">
          <Image
            src="/metaoptics-ai/3d-non-contact-recognition.svg"
            alt="3D Non-Contact Recognition"
            width={40}
            height={40}
            className="hidden xl:block w-[40px] h-[40px] object-contain"
            unoptimized
          />
          3D Non-Contact Recognition
        </div>
        <div className="flex-grow h-[1px] bg-[#e3e3e3]"></div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 xl:gap-20">
        {/* Left Content */}
        <div className="xl:col-span-7 flex flex-col gap-10 order-2 xl:order-1">
          <div>
            <div className="flex flex-col gap-5 mt-4">
              <p className="futura-medium text-[16px] xl:text-xl text-[#676767]">
                MetaOptics' 3D non-contact recognition module enables touchless
                biometric fingerprint detection and identification using
                metalens camera imagery — no physical contact with a sensor
                required. A trained neural network detects fingerprint ridge
                patterns from images captured at working distance, extracts
                identifying features, and matches them against stored templates.
                The compact form factor and extended depth-of-field of metalens
                optics make this ideal for touchless authentication in access
                control, mobile devices, and secure identification systems.
                Fingerprint recognition powered by metalens-grade optical
                resolution 3D depth sensing for accurate, liveness-aware facial
                and biometric capture Compact sensor integration suited to IoT
                devices, access control, and mobile platforms
              </p>
            </div>
          </div>
        </div>

        {/* Right Image */}
        <div className="xl:col-span-5 flex items-center justify-center order-1 xl:order-2">
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

export default NonContactRecognition;
