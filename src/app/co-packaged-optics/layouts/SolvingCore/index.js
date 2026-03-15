import HeadingTitle from "@/components/HeadingTitle";
import Image from "next/image";

const ChallengeItem = ({ icon, title, problem, solution }) => (
  <div>
    <div className="flex items-center gap-3 mb-4">
      <Image
        src={icon}
        alt={title}
        width={0}
        height={0}
        sizes="100vw"
        className="xl:w-8 xl:h-8 w-6 h-6"
      />
      <h4 className="futura-medium text-[16px] xl:text-xl text-[#111]">
        {title}
      </h4>
    </div>
    <div className="border border-[#e3e3e3] grid grid-cols-1 md:grid-cols-2">
      <div className="p-5 xl:p-6 pb-4">
        <div className="futura-bold text-[#676767] mb-3 xl:text-xl text-base">
          Problem:
        </div>
        <p className="futura-medium text-[#676767] text-base xl:text-xl">
          {problem}
        </p>
      </div>
      <div className="p-5 xl:p-6 pb-4 border-t md:border-t-0 md:border-l border-[#e3e3e3]">
        <div className="futura-bold text-[#d34c39] mb-3 xl:text-xl text-base">
          How Metalens Helps:
        </div>
        <p className="futura-medium text-[#d34c39] text-[15px] xl:text-xl text-base">
          {solution}
        </p>
      </div>
    </div>
  </div>
);

const challenges = [
  {
    icon: "/product-details/cpo/icon-1.svg",
    title: "Fiber-to-Chip Alignment",
    problem:
      "Hundreds of fibers must connect to the chip with sub-micron precision. Misalignment reduces bandwidth and efficiency.",
    solution:
      "Metalens focuses and steers light precisely, allowing simpler, passive alignment.",
  },
  {
    icon: "/product-details/cpo/icon-2.svg",
    title: "Packaging Density",
    problem:
      "Optics are inside tight CPO packages, making traditional bulky components impractical.",
    solution:
      "Ultra-thin, planar design fits compactly, enabling high-density integration.",
  },
  {
    icon: "/product-details/cpo/icon-3.svg",
    title: "Thermal and Mechanical Stress",
    problem:
      "High power chips generate heat; bulky optics or moving parts are vulnerable to deformation and failure.",
    solution:
      "Solid-state, robust optics survive heat and stress, improving reliability.",
  },
];

const SolvingCore = () => {
  return (
    <div>
      <HeadingTitle title="Solving the Core CPO Challenges" />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 xl:gap-20 xl:mt-12 mt-6">
        {/* Left Section (Content) */}
        <div className="xl:col-span-7 flex flex-col gap-10">
          <div>
            <h3 className="futura-bold text-[18px] xl:text-[20px] text-black">
              Precision Engineering for Every CPO Pain Point
            </h3>
            <p className="futura-medium text-[16px] xl:text-[18px] text-[#676767] mt-4">
              CPO introduces some of the most demanding requirements in modern
              photonics. MetaOptics metalens technology is engineered to address
              each of them directly.
            </p>
          </div>

          <div className="flex flex-col gap-8">
            {challenges.map((challenge, index) => (
              <ChallengeItem key={index} {...challenge} />
            ))}
          </div>
        </div>

        {/* Right Section (Images) */}
        <div className="xl:col-span-5 flex flex-col gap-10 xl:gap-20 mt-10 xl:mt-0 items-center justify-center">
          <div className="relative w-full aspect-[4/3] max-w-[420px] mx-auto flex items-center justify-center">
            <Image
              src="/product-details/cpo/solving-1.png"
              alt="Solving CPO Challenge 1"
              fill
              className="object-contain"
              unoptimized
            />
          </div>
          <div className="relative w-full aspect-[4/3] max-w-[420px] rounded-2xl overflow-hidden mx-auto">
            <Image
              src="/product-details/cpo/solving-2.png"
              alt="Solving CPO Challenge 2"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolvingCore;
