import Link from "next/link";
import BaseButton from "@/components/BaseButton";

const ProductDetailsUpgradability = ({ upgradability }) => {
  if (!upgradability) return null;
  const { title, description, cta } = upgradability;

  return (
    <section className="2xl:px-[104px] 2xl:py-[80px] xl:px-[50px] xl:py-[60px] lg:px-[40px] lg:py-[50px] py-10 px-6 bg-[#EAEAEA]">
      <div className="max-w-[1320px] mx-auto">
        <h2 className="xl:text-[48px] lg:text-[36px] text-[22px] futura-condensed-medium font-medium text-[#d34c39] uppercase border-b border-[#BFBFBF] pb-3">
          {title}
        </h2>

        {description && (
          <p className="xl:text-[20px] lg:text-[18px] text-[14px] text-[#000] font-medium mt-6 leading-relaxed">
            {description}
          </p>
        )}

        {cta?.label && cta?.link && (
          <Link href={cta.link} className="inline-block">
            <BaseButton
              label={cta.label}
              className="!mt-6 !justify-start"
              classNameBtn="uppercase"
            />
          </Link>
        )}
      </div>
    </section>
  );
};

export default ProductDetailsUpgradability;
