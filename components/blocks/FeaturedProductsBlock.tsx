"use client";

import ProductCard from "../cards/ProductCard";
import { TFeaturedProductsBlock } from "@/interfaces";
import PaddingContainer from "../common/PaddingContainer";

const FeaturedProductsBlock = ({
  block,
}: {
  block: TFeaturedProductsBlock;
}) => {
  const validProducts = block.item.products.filter(
    (item) => item.products_id !== null
  );
  return (
    <section className="py-10 ">
      <PaddingContainer>
        <h2 className="text-2xl md:text-3xl font-bold mb-8">
          {block.item.header_text || "Featured Products"}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {validProducts &&
            block.item.products.map((product) => (
              <ProductCard
                key={product.products_id.id}
                product={product.products_id}
              />
            ))}
        </div>
      </PaddingContainer>
    </section>
  );
};

export default FeaturedProductsBlock;
