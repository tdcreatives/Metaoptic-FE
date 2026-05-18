import Image from "next/image";
import clsx from "clsx";

const ProductDetailsPlatformVersions = ({ platformVersions }) => {
  if (!platformVersions) return null;
  const { title, description, images, versions } = platformVersions;

  return (
    <section className="2xl:px-[104px] 2xl:py-[80px] xl:px-[50px] xl:py-[60px] lg:px-[40px] lg:py-[50px] py-10 px-6 bg-white">
      <div className="max-w-[1320px] mx-auto">
      <h2 className="xl:text-[40px] lg:text-[32px] text-[28px] futura-condensed-medium font-medium text-[#d34c39] uppercase border-b border-[#BFBFBF] pb-3">
        {title}
      </h2>

      {description && (
        <p className="xl:text-[16px] lg:text-[15px] text-[14px] text-[#000] font-medium mt-6 leading-relaxed">
          {description}
        </p>
      )}

      {images?.length > 0 && (
        <div className="flex flex-col lg:flex-row justify-center items-center gap-6 lg:gap-10 mt-10">
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
        <div className="grid lg:grid-cols-3 grid-cols-1 mt-12 lg:gap-0 gap-10">
          {versions.map((v, idx) => (
            <div
              key={idx}
              className={clsx(
                "flex flex-col px-6 first:pl-0 last:pr-0",
                idx > 0 && "lg:border-l lg:border-[#D9D9D9]"
              )}
            >
              <h3 className="text-[18px] futura-medium font-bold text-[#000]">
                {v.title}
              </h3>

              {v.range && (
                <div className="mt-3 inline-block self-start border border-[#000] px-3 py-1 text-[14px] text-[#000]">
                  {v.range}
                </div>
              )}

              {v.description && (
                <p className="text-[14px] text-[#000] leading-relaxed mt-5">
                  {v.description}
                </p>
              )}

              {v.applications?.length > 0 && (
                <>
                  <h4 className="text-[14px] futura-medium font-medium text-[#000] mt-8">
                    Suggested Applications
                  </h4>
                  <ul className="list-disc list-outside pl-5 mt-3 space-y-2">
                    {v.applications.map((app, ai) => (
                      <li
                        key={ai}
                        className="text-[14px] text-[#000] leading-relaxed"
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
    </section>
  );
};

export default ProductDetailsPlatformVersions;
