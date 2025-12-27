import ProductDetailsKeyFeaturesLeftSection from "./left-section";
import ProductDetailsKeyFeaturesRightSection from "./right-section";

const ProductDetailsKeyFeatures = ({ keyFeatures }) => {
  return (
    <div className="xl:px-[104px] xl:py-[108px] bg-[#EAEAEA] flex xl:flex-row flex-col gap-20">
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
