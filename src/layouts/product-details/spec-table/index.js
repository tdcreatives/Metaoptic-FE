const ProductDetailsSpecTable = ({ specTable }) => {
  if (!specTable?.rows?.length) return null;
  const { title, headers, rows, note } = specTable;

  return (
    <section className="2xl:px-[104px] 2xl:py-[80px] xl:px-[50px] xl:py-[60px] lg:px-[40px] lg:py-[50px] py-10 px-6 bg-white">
      <div className="max-w-[1320px] mx-auto">
        <h2 className="xl:text-[40px] lg:text-[32px] text-[28px] futura-condensed-medium font-medium text-[#d34c39] uppercase border-b border-[#BFBFBF] pb-3">
          {title}
        </h2>

        <div className="overflow-x-auto mt-10">
          <table className="w-full border-collapse text-[14px]">
            {headers?.length > 0 && (
              <thead>
                <tr className="bg-[#EAEAEA]">
                  {headers.map((h, i) => (
                    <th
                      key={i}
                      className="border border-[#D9D9D9] px-4 py-4 text-center font-medium text-[#000]"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {rows.map((row, idx) => (
                <tr key={idx}>
                  <td className="border border-[#D9D9D9] px-4 py-4 text-center font-medium text-[#000] align-middle">
                    {row.label}
                  </td>
                  {row.merged !== undefined ? (
                    <td
                      colSpan={(headers?.length || 4) - 1}
                      className="border border-[#D9D9D9] px-4 py-4 text-center text-[#555]"
                    >
                      {row.merged}
                    </td>
                  ) : (
                    row.values?.map((v, vi) => (
                      <td
                        key={vi}
                        className="border border-[#D9D9D9] px-4 py-4 text-center text-[#555]"
                      >
                        {v}
                      </td>
                    ))
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {note && (
          <p className="text-[14px] text-[#555] mt-4">{note}</p>
        )}
      </div>
    </section>
  );
};

export default ProductDetailsSpecTable;
