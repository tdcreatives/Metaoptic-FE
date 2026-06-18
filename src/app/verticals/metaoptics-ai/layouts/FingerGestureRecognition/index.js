import React from "react";
import Image from "next/image";

const FingerGestureRecognition = () => {
  return (
    <div className="xl:pt-[80px] pt-[40px]">
      {/* Gesture Recognition AI Header */}
      <div className="flex items-center mb-8 xl:mb-12">
      <div className="bg-[#d34c39] text-white px-[16px] py-[8px] xl:px-[32px] xl:py-[16px] text-[30px] xl:text-[40px] uppercase futura-condensed-medium tracking-wide rounded-md flex items-center gap-3">
          <Image
            src="/metaoptics-ai/finger-gesture-recognition.svg"
            alt="Finger Gesture Recognition"
            width={40}
            height={40}
            className="hidden xl:block w-[40px] h-[40px] object-contain"
            unoptimized
          />
          Finger Gesture Recognition
        </div>
        <div className="flex-grow h-[1px] bg-[#e3e3e3]"></div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 xl:gap-20">
        {/* Left Content */}
        <div className="xl:col-span-7 flex flex-col gap-10 order-2 xl:order-1 xl:justify-center">
          <div>
           
            <div className="flex flex-col gap-5 mt-4">
              <p className="futura-medium text-[16px] xl:text-xl text-[#676767]">
              MetaOptics' finger gesture recognition module uses deep learning to detect and classify finger poses from metalens camera feeds in real time. The current model recognizes finger counting gestures from 0 to 9, outputting classification results for downstream application logic. This enables touchless input for smart glasses, IoT devices, and embedded vision systems powered by MetaOptics camera modules.
            Real-time hand and gesture detection via metalens IoT camera
            AI model trained for robust detection across varied lighting and backgrounds
            Compact form factor suited for AR/VR, HUD systems, and smart device integration
              </p>              
            </div>            
          </div>
        </div>

        {/* Right Video */}
        <div className="xl:col-span-5 flex items-center justify-center order-1 xl:order-2">
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

export default FingerGestureRecognition;
