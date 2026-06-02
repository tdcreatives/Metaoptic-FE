const renderItem = (item, index) => (
  <li key={index} className="xl:text-[20px] lg:text-[18px] text-[14px] text-[#676767] font-medium leading-relaxed">
    {item.label}
    {item.children?.length > 0 && (
      <ul className="list-disc list-outside pl-8 mt-2 space-y-2">
        {item.children.map((child, ci) => (
          <li key={ci} className="xl:text-[20px] lg:text-[18px] text-[14px] text-[#676767] font-medium">
            {child}
          </li>
        ))}
      </ul>
    )}
  </li>
);

const ProductDetailsDualColumnList = ({ dualColumnList }) => {
  if (!dualColumnList?.columns?.length) return null;

  return (
    <section className="2xl:px-[104px] 2xl:py-[80px] xl:px-[50px] xl:py-[60px] lg:px-[40px] lg:py-[50px] py-10 px-6 bg-[#EAEAEA]">
      <div className="max-w-[1320px] mx-auto grid lg:grid-cols-2 grid-cols-1 lg:gap-20 gap-10">
        {dualColumnList.columns.map((col, idx) => (
          <div key={idx} className="flex flex-col">
            <h2 className="xl:text-[48px] lg:text-[36px] text-[22px] futura-condensed-medium font-medium text-[#d34c39] uppercase border-b border-[#BFBFBF] pb-3">
              {col.title}
            </h2>

            {col.subtitle && (
              <p className="xl:text-[20px] lg:text-[18px] text-[14px] text-[#111] font-medium mt-6 leading-relaxed">
                {col.subtitle}
              </p>
            )}

            {col.items?.length > 0 && (
              <ul className="list-disc list-outside pl-5 mt-6 space-y-3">
                {col.items.map((item, i) => renderItem(item, i))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductDetailsDualColumnList;
