import Image from "next/image";
import clsx from "clsx";

const RightSectionCard = ({ item }) => {
  return (
    <div className="rounded-[32px] p-[1px] bg-[#C73C29]">
      <div className="px-10 py-[100px] rounded-[32px] flex gap-4 w-full">
        <Image
          src={item.image}
          alt={item.title}
          width={0}
          height={0}
          sizes="100vw"
          className="w-[450px] h-auto object-cover"
        />
        <div>
          <div
            className={clsx(
              "flex gap-4 items-start",
              item.isTitleBelowSubtitle
                ? "flex-col items-start justify-start"
                : "flex-col-reverse items-start justify-end"
            )}
          >
            <h2
              className="!font-bold xl:text-[32px] futura-medium text-white uppercase leading-[38px] opacity-80"
              dangerouslySetInnerHTML={{ __html: item.subtitleDom }}
            ></h2>

            {item.titleImage && (
              <Image
                src={item.titleImage}
                alt={item.title}
                width={0}
                height={0}
                sizes="100vw"
                className="w-full h-auto object-cover"
              />
            )}
          </div>

          <div className="xl:mt-[60px] futura-medium text-white xl:text-lg opacity-80">
            {item.description}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightSectionCard;
