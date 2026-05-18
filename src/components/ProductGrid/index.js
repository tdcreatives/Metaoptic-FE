import HeadingTitle from "@/components/HeadingTitle";
import BaseProduct from "@/components/BaseProduct";

const ProductGrid = ({ products = [] }) => {
  return (
    <div>
      <HeadingTitle title="Products" />

      <div className="grid xl:grid-cols-2 grid-cols-1 xl:gap-14 gap-10">
        {products.map((product, index) => (
          <div
            key={index}
            className="min-[1440px]:even:mt-[80px] min-[1920px]:even:mt-[120px]"
          >
            <BaseProduct
              name={product.name}
              image={product.image}
              slug={product.slug}
                href={product.href}
              imageClassName={product?.imageClassName || ""}
              className="xl:h-[370px] h-auto"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;
