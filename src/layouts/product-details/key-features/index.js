import ProductDetailsKeyFeaturesLeftSection from "./left-section";
import ProductDetailsKeyFeaturesRightSection from "./right-section";

const ProductDetailsKeyFeatures = ({ keyFeatures }) => {
  return (
    <div className="xl:px-[104px] xl:py-[108px] py-8 px-6 bg-[#EAEAEA] flex xl:flex-row flex-col gap-[80px]">
      <ProductDetailsKeyFeaturesLeftSection
        leftSection={keyFeatures.leftSection}
      />
      <ProductDetailsKeyFeaturesRightSection
        rightSection={keyFeatures.rightSection}
      />
    </div>
  );
};

export default ProductDetailsKeyFeatures;
