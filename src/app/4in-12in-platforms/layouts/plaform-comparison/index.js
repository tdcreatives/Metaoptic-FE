import HeadingTitle from "@/components/HeadingTitle";

const comparisonData = [
  {
    feature: "Fabrication Technique",
    fourIn: "Direct Laser Writing",
    twelveIn: "DUV Immersion Photolithography",
  },
  {
    feature: "Critical Dimension",
    fourIn: "100 Nm",
    twelveIn: "80 Nm",
  },
  {
    feature: "Wafer Size",
    fourIn: '4" (Glass, Silicon, Etc.)',
    twelveIn: '12" (Glass, Silicon, Etc.)',
  },
  {
    feature: "Production Volume",
    fourIn: "Low Volume",
    twelveIn: "Mass Production, High Yield",
  },
  {
    feature: "Environment",
    fourIn: "Non-Vacuum",
    twelveIn: "Semiconductor-Grade",
  },
  {
    feature: "Aspect Ratio",
    fourIn: "Standard",
    twelveIn: "1/8 After Dry Etching",
  },
  {
    feature: "Best For",
    fourIn: "R&D, Fast Prototyping, Design Validation",
    twelveIn: "OEM Supply, Commercial Production, Scale-Up",
  },
];

const PlatformComparison = () => {
  return (
    <div className="xl:pt-[80px] pt-[40px]">
      <HeadingTitle title="Platform Comparison" />

      <div className="xl:mt-12 mt-6 flex flex-col gap-6">
        <h3 className="futura-bold text-[18px] xl:text-[20px] text-black">
          Choosing the Right Platform
        </h3>
        <p className="futura-medium text-[16px] xl:text-[18px] text-[#676767]">
          Not sure which platform fits your project? Use this as a starting
          guide. Our team can help you determine the right fabrication approach
          based on your application, timeline, and volume requirements.
        </p>
      </div>

      <div className="overflow-x-auto mt-10">
        <table className="w-full min-w-[700px] border-collapse border border-[#D3D0D0] text-center">
          <thead>
            <tr className="bg-[#EAEAEA]">
              <th className="border border-[#D3D0D0] py-4 px-4 futura-bold text-[#333] text-[15px] xl:text-[16px] uppercase w-[25%]">
                Feature
              </th>
              <th className="border border-[#D3D0D0] py-4 px-4 futura-bold text-[#333] text-[15px] xl:text-[16px] uppercase w-[37.5%]">
                4" Platform
              </th>
              <th className="border border-[#D3D0D0] py-4 px-4 futura-bold text-[#333] text-[15px] xl:text-[16px] uppercase w-[37.5%]">
                12" Platform
              </th>
            </tr>
          </thead>
          <tbody>
            {comparisonData.map((row, idx) => (
              <tr key={idx}>
                <td className="border border-[#D3D0D0] py-4 px-4 futura-bold text-[#333] text-[15px] xl:text-[14px]">
                  {row.feature}
                </td>
                <td className="border border-[#D3D0D0] py-4 px-4 futura-medium text-[#333] text-[15px] xl:text-[14px]">
                  {row.fourIn}
                </td>
                <td className="border border-[#D3D0D0] py-4 px-4 futura-medium text-[#333] text-[15px] xl:text-[14px]">
                  {row.twelveIn}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PlatformComparison;
