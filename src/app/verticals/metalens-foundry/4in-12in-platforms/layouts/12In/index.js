import Image from "next/image";

const InfoCard = ({ title, value, description }) => (
  <div className="bg-[rgba(211,76,57,0.1)] p-8 flex flex-col items-center justify-center text-center rounded-[8px]">
    <span className="futura-medium text-[#d34c39] uppercase tracking-wide text-[16px] xl:text-xl">
      {title}
    </span>
    <span className="futura-medium text-[#d34c39] text-[28px] xl:text-[36px] mt-4 mb-3">
      {value}
    </span>
    <span className="futura-medium text-[#676767] text-base xl:text-xl">
      {description}
    </span>
  </div>
);

const infoCardsData = [
  {
    title: "Critical Dimension",
    value: "80 nm",
    description: "Feature resolution",
  },
  {
    title: "Wafer Size",
    value: '12"',
    description: "Glass, Silicon, and more",
  },
  {
    title: "Volume",
    value: "High",
    description: "Commercial scale",
  },
];

const badges = [
  "Mass-production",
  "High yield",
  "Aspect ratio 1/8 after dry etching",
];

const TwelveInPlatformsLayout = () => {
  return (
    <div className="xl:pt-[80px] pt-[40px]">
      {/* 12" Platform Header */}
      <div className="flex items-center mb-8 xl:mb-12">
        <div className="bg-[#d34c39] text-white px-5 py-2 xl:text-[40px] text-[24px] uppercase futura-condensed-medium tracking-wide rounded-md">
          12" Platform
        </div>
        <div className="flex-grow h-[1px] bg-[#e3e3e3]"></div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 xl:gap-20">
        {/* Left Content */}
        <div className="xl:col-span-7 flex flex-col gap-10">
          <div>
            <h3 className="futura-bold text-[18px] xl:text-[24px] text-black">
              Mass Production Ready
            </h3>
            <div className="flex flex-col gap-5 mt-4">
              <p className="futura-medium text-[16px] xl:text-xl text-[#676767]">
                Our 12" platform uses DUV immersion photolithography to deliver
                high-yield metalens production at scale. With a critical
                dimension of 80nm and an aspect ratio of 1/8 after dry etching,
                this platform is built for customers ready to move from
                development into full commercial production.
              </p>
              <p className="futura-medium text-[16px] xl:text-xl text-[#676767]">
                It combines the precision of semiconductor-grade lithography
                with the throughput needed for large-volume metalens
                manufacturing, making it the right choice for OEM supply chains
                and commercial product rollouts.
              </p>
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-3">
            {badges.map((badge, idx) => (
              <span
                key={idx}
                className="border border-[rgba(18,18,18,0.8)] text-[#000] px-3 py-1.5 futura-medium text-base xl:text-[20px]"
              >
                {badge}
              </span>
            ))}
          </div>

          <div>
            <h3 className="futura-bold text-[18px] xl:text-[24px] text-black">
              Technique: DUV Immersion Photolithography
            </h3>
            <p className="futura-medium text-base xl:text-xl text-[#676767] mt-4">
              Deep ultraviolet light is projected through a liquid medium to
              print lens patterns onto 12" wafers at high resolution and
              throughput, enabling the consistent, repeatable fabrication
              required for mass production and high-yield supply.
            </p>
          </div>
        </div>

        {/* Right Image */}
        <div className="xl:col-span-5 flex items-center justify-center">
          <Image
            src="/product-details/4in-12in-platforms/12in-1.png"
            alt="DUV Immersion Photolithography"
            width={0}
            height={0}
            sizes="100vw"
            className="w-full h-auto object-contain"
            unoptimized
          />
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 xl:mt-16">
        {infoCardsData.map((card, idx) => (
          <InfoCard key={idx} {...card} />
        ))}
      </div>

      {/* Images Bottom Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-10 xl:mt-12 items-start">
        {/* Left Image */}
        <div className="md:col-span-4 flex flex-col text-center">
          <div className="relative w-full h-[250px] xl:h-[376px]">
            <Image
              src="/product-details/4in-12in-platforms/12in-2.png"
              alt='12" Wafer – Metalens Array'
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover rounded-[4px]"
              unoptimized
            />
          </div>
          <span className="futura-medium text-[13px] xl:text-base text-[#676767] mt-3">
            12" Wafer – Metalens Array
          </span>
        </div>

        {/* Right Image */}
        <div className="md:col-span-8 flex flex-col text-center">
          <div className="relative w-full h-[250px] xl:h-[376px]">
            <Image
              src="/product-details/4in-12in-platforms/12in-3.png"
              alt="80nm Feature Detail"
              fill
              sizes="(max-width: 768px) 100vw, 66vw"
              className="object-cover rounded-[4px]"
              unoptimized
            />
          </div>
          <span className="futura-medium text-[13px] xl:text-base text-[#676767] mt-3">
            80nm Feature Detail
          </span>
        </div>
      </div>
    </div>
  );
};

export default TwelveInPlatformsLayout;
