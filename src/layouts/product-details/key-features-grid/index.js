const ICONS = {
  maximize: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-full h-full"
    >
      <polyline points="15 3 21 3 21 9" />
      <polyline points="9 21 3 21 3 15" />
      <line x1="21" y1="3" x2="14" y2="10" />
      <line x1="3" y1="21" x2="10" y2="14" />
    </svg>
  ),
  modular: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-full h-full"
    >
      <circle cx="12" cy="6" r="3" />
      <circle cx="6" cy="17" r="3" />
      <circle cx="18" cy="17" r="3" />
      <line x1="12" y1="9" x2="6" y2="14" />
      <line x1="12" y1="9" x2="18" y2="14" />
      <line x1="9" y1="17" x2="15" y2="17" />
    </svg>
  ),
  dollar: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-full h-full"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M15 8.5c-.79-.79-2.05-1.5-3-1.5-1.66 0-3 .9-3 2s1.34 2 3 2 3 .9 3 2-1.34 2-3 2c-.95 0-2.21-.71-3-1.5" />
      <line x1="12" y1="5" x2="12" y2="7" />
      <line x1="12" y1="17" x2="12" y2="19" />
    </svg>
  ),
  atom: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-full h-full"
    >
      <circle cx="12" cy="12" r="1.5" />
      <ellipse cx="12" cy="12" rx="10" ry="4" />
      <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" />
    </svg>
  ),
};

const ProductDetailsKeyFeaturesGrid = ({ keyFeaturesGrid }) => {
  if (!keyFeaturesGrid) return null;
  const { title, description, items } = keyFeaturesGrid;

  return (
    <section className="2xl:px-[104px] 2xl:py-[80px] xl:px-[50px] xl:py-[60px] lg:px-[40px] lg:py-[50px] py-10 px-6 bg-white">
      <div className="max-w-[1320px] mx-auto">
        <h2 className="xl:text-[48px] lg:text-[36px] text-[22px] futura-condensed-medium font-medium text-[#d34c39] uppercase border-b border-[#D9D9D9] pb-4">
          {title}
        </h2>

        {description && (
          <p className="xl:text-[20px] lg:text-[18px] text-[14px] text-[#111] font-medium mt-6 leading-relaxed">
            {description}
          </p>
        )}

        <div className="grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-6 mt-10">
          {items?.map((item, index) => (
            <div
              key={index}
              className="rounded-[16px] bg-[#FDEEEC] p-6 flex flex-col gap-3"
            >
              <div className="w-8 h-8 text-[#d34c39]">{ICONS[item.icon]}</div>
              <h3 className="xl:text-[24px] lg:text-[22px] text-[18px] futura-medium font-medium text-[#d34c39]">
                {item.title}
              </h3>
              <p className="xl:text-[20px] lg:text-[18px] text-[14px] text-[#676767] font-medium leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductDetailsKeyFeaturesGrid;
