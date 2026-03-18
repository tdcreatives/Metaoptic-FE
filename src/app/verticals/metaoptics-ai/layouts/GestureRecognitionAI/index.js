import React from "react";

const GestureRecognitionAI = () => {
  return (
    <div className="xl:pt-[80px] pt-[40px]">
      {/* Gesture Recognition AI Header */}
      <div className="flex items-center mb-8 xl:mb-12">
        <div className="bg-[#d34c39] text-white px-5 py-2 xl:text-[40px] text-[24px] uppercase futura-condensed-medium tracking-wide rounded-md">
          GESTURE RECOGNITION AI
        </div>
        <div className="flex-grow h-[1px] bg-[#e3e3e3]"></div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 xl:gap-20">
        {/* Left Content */}
        <div className="xl:col-span-7 flex flex-col gap-10">
          <div>
            <h3 className="futura-bold text-[18px] xl:text-[24px] text-black">
              Hands-Free Interaction, Precisely Tracked
            </h3>
            <div className="flex flex-col gap-5 mt-4">
              <p className="futura-medium text-[16px] xl:text-xl text-[#676767]">
                MetaOptics Gesture Recognition AI enables natural, touchless
                human-machine interaction by combining our metalens camera
                system with trained recognition models that identify and
                interpret hand gestures in real time.
              </p>
              <p className="futura-medium text-[16px] xl:text-xl text-[#676767]">
                Designed for environments where precision and responsiveness
                matter — from industrial interfaces to consumer AR and smart
                device controls — the system delivers reliable detection without
                the bulk of traditional depth cameras.
              </p>
            </div>

            <ul className="list-disc pl-5 mt-8 flex flex-col gap-5">
              <li className="futura-medium text-[16px] xl:text-[20px] text-[#111111]">
                Real-time hand and gesture detection via metalens IoT camera
              </li>
              <li className="futura-medium text-[16px] xl:text-[20px] text-[#111111]">
                AI model trained for robust detection across varied lighting and
                backgrounds
              </li>
              <li className="futura-medium text-[16px] xl:text-[20px] text-[#111111]">
                Compact form factor suited for AR/VR, HUD systems, and smart
                device integration
              </li>
            </ul>
          </div>
        </div>

        {/* Right Video */}
        <div className="xl:col-span-5 flex items-center justify-center">
          <div className="relative w-full max-w-[650px] aspect-square rounded-2xl overflow-hidden shadow-2xl bg-black">
            <video
              className="w-full h-full object-contain"
              autoPlay
              muted
              loop
              playsInline
            >
              <source
                src="/metaoptics-ai/introduction.webm"
                type="video/webm"
              />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GestureRecognitionAI;
