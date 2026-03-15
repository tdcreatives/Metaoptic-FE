import HeadingTitle from "@/components/HeadingTitle";

const WhatCoPackaged = () => {
  return (
    <div className="xl:pt-[120px] xl:pb-[80px]">
      <HeadingTitle title="What is Co-Packaged Optics?" />

      <div className="flex flex-col gap-5 text-black xl:text-lg text-[16px] xl:mt-10 mt-6">
        <p className="futura-medium font-medium">
          Bringing Optics and Electronics Closer Together
        </p>

        <p className="futura-medium text-[#676767]">
          Co-Packaged Optics (CPO) combine electrical and optical functions in
          ultra-compact packages, boosting bandwidth, energy efficiency, and
          signal quality for data centers and AI infrastructures.
          <br />
          As CPO becomes the backbone of next-generation compute networks, the
          optics inside these packages need to be just as advanced. MetaOptics
          metalens technology is built for exactly this challenge.
        </p>
      </div>
      <div className="flex flex-col gap-5 text-black xl:text-lg text-[16px] xl:mt-10 mt-6">
        <p className="futura-medium">
          CPO defines where optics are needed. Metalens define how light is
          efficiently delivered.
        </p>

        <p className="futura-medium font-normal text-[#676767]">
          MetaOptics has successfully prototyped a 127µm diameter co-packaged
          optical component, setting new standards for miniaturization and
          scalability, and positioning the company as a leader in next-gen
          optical interconnects.
        </p>
      </div>
    </div>
  );
};

export default WhatCoPackaged;
