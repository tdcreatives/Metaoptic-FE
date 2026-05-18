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
    value: "100 nm",
    description: "Feature resolution",
  },
  {
    title: "Wafer Size",
    value: '4"',
    description: "Glass, Silicon, and more",
  },
  {
    title: "Volume",
    value: "Low",
    description: "Prototype & R&D scale",
  },
];

const badges = [
  "Fast prototyping",
  "Low volume",
  "Non-vacuum",
  "High-precision stage",
];

const FourInPlatformsLayout = () => {
  return (
    <div className="xl:pt-[80px] pt-[40px]">
      {/* 4" Platform Header */}
      <div className="flex items-center mb-8 xl:mb-12">
        <div className="bg-[#d34c39] text-white px-5 py-2 xl:text-[40px] text-[24px] uppercase futura-condensed-medium tracking-wide rounded-md">
          4" Platform
        </div>
        <div className="flex-grow h-[1px] bg-[#e3e3e3]"></div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 xl:gap-20">
        {/* Left Content */}
        <div className="xl:col-span-7 flex flex-col gap-10">
          <div>
            <h3 className="futura-bold text-[18px] xl:text-[24px] text-black">
              Fast Prototyping at Lower Volume
            </h3>
            <div className="flex flex-col gap-5 mt-4">
              <p className="futura-medium text-[16px] xl:text-xl text-[#676767]">
                Our 4" platform uses the MetaOptics Direct Laser Writer to
                fabricate metalenses with a critical dimension of 100nm, making
                it the ideal choice for research, early-stage development, and
                lower volume production runs.
              </p>
              <p className="futura-medium text-[16px] xl:text-xl text-[#676767]">
                Operating in a non-vacuum environment with a high-precision
                stage, it offers a faster and more accessible entry point for
                teams looking to develop and validate custom metalens designs
                before committing to full-scale production.
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
              Technique: Direct Laser Writing
            </h3>
            <p className="futura-medium text-base xl:text-xl text-[#676767] mt-4">
              A focused laser beam patterns the lens geometry at nanoscale
              resolution directly onto the substrate, enabling precise, flexible
              fabrication without the need for vacuum or complex lithographic
              masks.
            </p>
          </div>
        </div>

        {/* Right Image */}
        <div className="xl:col-span-5 flex items-center justify-center">
          <Image
            src="/product-details/4in-12in-platforms/4in-1.png"
            alt="Direct Laser Writer"
            width={0}
            height={0}
            sizes="100vw"
            className="w-full max-w-[500px] h-auto object-contain"
            unoptimized
          />
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 xl:gap-[84px] gap-6 mt-12 xl:mt-16">
        {infoCardsData.map((card, idx) => (
          <InfoCard key={idx} {...card} />
        ))}
      </div>

      {/* Images Bottom Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-10 xl:mt-12 items-stretch">
        {/* Left Image (Larger) */}
        <div className="md:col-span-3 flex flex-col text-center">
          <Image
            src="/product-details/4in-12in-platforms/4in-2.png"
            alt="Circular Lens Pattern"
            width={0}
            height={0}
            sizes="100vw"
            className="w-full h-full object-cover rounded-[4px] flex-grow"
            unoptimized
          />
          <span className="futura-medium text-[13px] xl:text-base text-[#676767] mt-3 block">
            Circular Lens Pattern
          </span>
        </div>

        {/* Right Image (Smaller) */}
        <div className="md:col-span-1 flex flex-col text-center">
          <Image
            src="/product-details/4in-12in-platforms/4in-3.png"
            alt="100nm Feature Detail"
            width={0}
            height={0}
            sizes="100vw"
            className="w-full h-full object-cover rounded-[4px] flex-grow"
            unoptimized
          />
          <span className="futura-medium text-[13px] xl:text-base text-[#676767] mt-3 block">
            100nm Feature Detail
          </span>
        </div>
      </div>
    </div>
  );
};

export default FourInPlatformsLayout;
