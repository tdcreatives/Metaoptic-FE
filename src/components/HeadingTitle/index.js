const HeadingTitle = ({ title }) => {
  return (
    <div>
      <div className="xl:text-[48px] text-[32px] uppercase relative z-30 futura-condensed-medium xl:mt-0 mt-3 text-start text-[#d34c39]">
        {title}
      </div>

      <div className="w-full h-[2px] bg-[#A9A9A9] mx-auto mb-8"></div>
    </div>
  );
};

export default HeadingTitle;
