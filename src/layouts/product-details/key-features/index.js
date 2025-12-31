import ProductDetailsKeyFeaturesLeftSection from "./left-section";
import ProductDetailsKeyFeaturesRightSection from "./right-section";

const ProductDetailsKeyFeatures = ({ keyFeatures }) => {
  return (
    <div className="2xl:px-[104px] 2xl:py-[108px] xl:px-[50px] xl:py-[50px] py-8 px-6 bg-[#EAEAEA] grid xl:grid-cols-2 grid-cols-1 gap-[80px]">
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
