import Image from "next/image";
import clsx from "clsx";

const ProductDetailsPlatformVersions = ({ platformVersions }) => {
  if (!platformVersions) return null;
  const { title, description, images, versions } = platformVersions;

  return (
    <section className="2xl:px-[104px] 2xl:py-[80px] xl:px-[50px] xl:py-[60px] lg:px-[40px] lg:py-[50px] py-10 px-6 bg-white">
      <div className="max-w-[1320px] mx-auto">
      <h2 className="xl:text-[48px] lg:text-[36px] text-[22px] futura-condensed-medium font-medium text-[#d34c39] uppercase border-b border-[#BFBFBF] pb-3">
        {title}
      </h2>

      {description && (
        <p className="xl:text-[20px] lg:text-[18px] text-[14px] text-[#111] font-medium mt-6 leading-relaxed">
          {description}
        </p>
      )}

      <div className="lg:border-0 border border-[#D3D0D0] mt-10">
      {images?.length > 0 && (
        <div className="flex flex-col lg:flex-row justify-center items-center gap-6 lg:gap-10 lg:p-0 p-6">
          {images[0] && (
            <div className="lg:w-[448px] w-full">
              <Image
                src={images[0]}
                alt={title}
                width={0}
                height={0}
                sizes="100vw"
                className="w-full h-auto object-contain"
              />
            </div>
          )}
          {images[1] && (
            <div className="lg:w-[352px] w-[221px]">
              <Image
                src={images[1]}
                alt={title}
                width={0}
                height={0}
                sizes="100vw"
                className="w-full h-auto object-contain"
              />
            </div>
          )}
        </div>
      )}

      {versions?.length > 0 && (
        <div className="grid lg:grid-cols-3 grid-cols-1 lg:mt-12 mt-0 gap-0 lg:border-t-0 border-t border-[#D3D0D0]">
          {versions.map((v, idx) => (
            <div
              key={idx}
              className={clsx(
                "flex flex-col lg:px-6 lg:first:pl-0 lg:last:pr-0 lg:p-0 p-6",
                idx > 0 && "lg:border-l lg:border-[#D3D0D0]",
                idx > 0 && "border-t border-[#D3D0D0] lg:border-t-0"
              )}
            >
              <h3 className="xl:text-[20px] text-[18px] futura-medium font-bold text-[#040404]">
                {v.title}
              </h3>

              {v.range && (
                <div className="mt-3 inline-block self-start border border-[#000] px-3 py-1 text-[14px] text-[#000]">
                  {v.range}
                </div>
              )}

              {v.description && (
                <p className="xl:text-[20px] lg:text-[18px] text-[14px] text-[#676767] font-medium leading-relaxed mt-5">
                  {v.description}
                </p>
              )}

              {v.applications?.length > 0 && (
                <>
                  <h4 className="text-[20px] futura-medium font-medium text-[#000] mt-8">
                    Suggested Applications
                  </h4>
                  <ul className="list-disc list-outside pl-5 mt-3 space-y-2">
                    {v.applications.map((app, ai) => (
                      <li
                        key={ai}
                        className="xl:text-[20px] lg:text-[18px] text-[14px] text-[#000] leading-relaxed"
                      >
                        {app}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          ))}
        </div>
      )}
      </div>
      </div>
    </section>
  );
};

export default ProductDetailsPlatformVersions;
