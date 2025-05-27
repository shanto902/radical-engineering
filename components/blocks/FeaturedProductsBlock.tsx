"use client";

import ProductCard from "../cards/ProductCard";
import { TFeaturedProductsBlock } from "@/interfaces";

const FeaturedProductsBlock = ({
  block,
}: {
  block: TFeaturedProductsBlock;
}) => {
  return (
    <section className="py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-8">
          {block.item.header_text || "Featured Products"}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {block.item.products.map((product) => (
            <ProductCard
              key={product.products_id.id}
              product={product.products_id}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProductsBlock;
