const SummaryTable = () => {
  const rows = [
    {
      id: 1,
      module: "Super-Resolution Imaging",
      keyBenefit:
        "Higher resolution from compact metalens sensors without increasing hardware cost",
    },
    {
      id: 2,
      module: "3D Non-Contact Recognition",
      keyBenefit:
        "Touchless biometric fingerprint authentication at working distance",
    },
    {
      id: 3,
      module: "Finger Gesture Recognition",
      keyBenefit:
        "Real-time touchless interaction for smart glasses and IoT devices",
    },
    {
      id: 4,
      module: "Brightening Imaging",
      keyBenefit:
        "Intelligent low-light enhancement that preserves detail and suppresses noise",
    },
    {
      id: 5,
      module: "Sharpening Imaging",
      keyBenefit:
        "Patent-pending, award-winning correction of metalens optical aberrations",
    }
  ];

  return (
    <div className="xl:pt-[80px] pt-[40px]">
      {/* Summary Table Header */}
      <div className="flex items-center mb-8 xl:mb-12">
        <div className="bg-[#d34c39] text-white px-5 py-2 xl:text-[40px] text-[24px] uppercase futura-condensed-medium tracking-wide rounded-md">
          Summary Table
        </div>
        <div className="flex-grow h-[1px] bg-[#e3e3e3]"></div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] border-collapse border border-[#D3D0D0] text-center">
          <thead>
            <tr className="bg-[#EAEAEA]">
              <th className="border border-[#D3D0D0] py-4 px-4 futura-bold text-[#333] text-[14px] md:text-[16px] xl:text-[20px] uppercase">
                #
              </th>
              <th className="border border-[#D3D0D0] py-4 px-4 futura-bold text-[#333] text-[14px] md:text-[16px] xl:text-[20px] uppercase">
                Module
              </th>
              <th className="border border-[#D3D0D0] py-4 px-4 futura-bold text-[#333] text-[14px] md:text-[16px] xl:text-[20px] uppercase">
                Key Benefit
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.feature}>
                <td className="border border-[#D3D0D0] py-4 px-4 futura-bold text-[#333] text-[14px] md:text-[16px] xl:text-[20px]">
                  {row.id}
                </td>
                <td className="border border-[#D3D0D0] py-4 px-4 futura-medium text-[#676767] text-[14px] md:text-[16px] xl:text-[20px]">
                  {row.module}
                </td>
                <td className="border border-[#D3D0D0] py-4 px-4 futura-medium text-[#676767] text-[14px] md:text-[16px] xl:text-[20px]">
                  {row.keyBenefit}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SummaryTable;

