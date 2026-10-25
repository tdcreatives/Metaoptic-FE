import Link from "next/link";
import Image from "next/image";
import BaseButton from "@/components/BaseButton";

const ProductDetailsCtaBanner = ({ ctaBanner }) => {
  if (!ctaBanner) return null;
  const { background, title, cta } = ctaBanner;

  return (
    <section className="relative w-full flex items-center justify-center lg:h-[364px] py-[60px] px-6 overflow-hidden">
      {background && (
        <Image
          src={background}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          priority={false}
        />
      )}
      <div className="absolute inset-0 bg-[#000000A6]" />

      <div className="relative z-10 flex flex-col items-center justify-center text-center">
        <h2 className="xl:text-[24px] lg:text-[22px] text-[18px] font-medium futura-medium text-white uppercase tracking-[3.2px]">
          {title}
        </h2>

        {cta?.label && cta?.link && (
          <Link href={cta.link}>
            <BaseButton
              label={cta.label}
              className="!mt-6"
              classNameBtn="uppercase"
            />
          </Link>
        )}
      </div>
    </section>
  );
};

export default ProductDetailsCtaBanner;
