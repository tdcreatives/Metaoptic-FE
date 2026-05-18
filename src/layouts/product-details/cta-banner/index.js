import Link from "next/link";
import Image from "next/image";
import BaseButton from "@/components/BaseButton";

const ProductDetailsCtaBanner = ({ ctaBanner }) => {
  if (!ctaBanner) return null;
  const { background, title, cta } = ctaBanner;

  return (
    <section className="relative w-full lg:py-[100px] py-[60px] px-6 overflow-hidden">
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
      <div className="absolute inset-0 bg-black/55" />

      <div className="relative z-10 flex flex-col items-center justify-center text-center">
        <h2 className="xl:text-[32px] lg:text-[28px] text-[20px] futura-medium text-white uppercase tracking-[2px]">
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
