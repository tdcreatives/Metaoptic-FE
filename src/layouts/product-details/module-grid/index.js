import clsx from "clsx";

const ProductDetailsModuleGrid = ({ moduleGrid }) => {
  if (!moduleGrid?.columns?.length) return null;
  const { title, columns } = moduleGrid;

  return (
    <section className="2xl:px-[104px] 2xl:py-[80px] xl:px-[50px] xl:py-[60px] lg:px-[40px] lg:py-[50px] py-10 px-6 bg-[#EAEAEA]">
      <div className="max-w-[1320px] mx-auto">
      <h2 className="xl:text-[40px] lg:text-[32px] text-[28px] futura-condensed-medium font-medium text-[#d34c39] uppercase border-b border-[#BFBFBF] pb-3">
        {title}
      </h2>

      <div className="grid lg:grid-cols-2 grid-cols-1 lg:gap-0 gap-10 mt-10">
        {columns.map((col, idx) => (
          <div
            key={idx}
            className={clsx(
              "flex flex-col",
              idx % 2 === 0 && "lg:pr-10",
              idx % 2 === 1 && "lg:pl-10 lg:border-l lg:border-[#BFBFBF]",
              idx < 2 && "lg:pb-12",
              idx >= 2 && "lg:pt-12 lg:border-t lg:border-[#BFBFBF]"
            )}
          >
            <h3 className="xl:text-[22px] lg:text-[20px] text-[18px] futura-condensed-medium font-medium text-[#d34c39] uppercase">
              {col.title}
            </h3>

            {col.description && (
              <p className="xl:text-[15px] lg:text-[14px] text-[14px] text-[#000] font-medium mt-4 leading-relaxed">
                {col.description}
              </p>
            )}

            {col.items?.length > 0 && (
              <ul className="list-disc list-outside pl-5 mt-4 space-y-2">
                {col.items.map((item, i) => (
                  <li
                    key={i}
                    className="text-[14px] text-[#5a5a5a] leading-relaxed"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
      </div>
    </section>
  );
};

export default ProductDetailsModuleGrid;
