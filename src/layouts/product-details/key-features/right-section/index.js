import RightSectionCard from "./RightSectionCard";

const ProductDetailsKeyFeaturesRightSection = ({ rightSection }) => {
  const { list } = rightSection;

  return (
    <div className="flex flex-col gap-7 w-full">
      {list.map((item, index) => (
        <div key={index}>
          <RightSectionCard item={item} />
        </div>
      ))}
    </div>
  );
};

export default ProductDetailsKeyFeaturesRightSection;
