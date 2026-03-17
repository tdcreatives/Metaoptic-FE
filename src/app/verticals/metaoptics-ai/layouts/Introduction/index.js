import HeadingTitle from "@/components/HeadingTitle";

const Introduction = () => {
  return (
    <div>
      <HeadingTitle title="Introduction" />

      <div className="py-5 flex flex-col gap-5 futura-medium xl:text-xl text-base text-[#111111]">
        <p>
          MetaOptics AI combines the precision of metalens technology with
          proprietary artificial intelligence, delivering software and hardware
          systems that see, recognise, and enhance with a level of accuracy
          conventional optics cannot match
        </p>

        <p>Metalens capture the light. Our AI makes sense of it.</p>

        <p className="text-[#676767]">
          MetaOptics is not just a hardware company. Our proprietary AI layer —
          built in partnership with leading AI and machine learning partners —
          sits directly on top of our optical systems, transforming raw image
          data into actionable intelligence.
        </p>

        <p className="text-[#676767]">
          From identifying a fingerprint to sharpening a low-resolution frame in
          real time, MetaOptics AI extends what our metalens products can do,
          and redefines what compact optical systems are capable of.
        </p>
      </div>
    </div>
  );
};

export default Introduction;
