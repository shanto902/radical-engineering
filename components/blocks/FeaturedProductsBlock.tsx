import ProductCard from "../cards/ProductCard";
import { TFeaturedProductsBlock, TProduct } from "@/interfaces";
import PaddingContainer from "../common/PaddingContainer";
import { fetchProductsWithLimitAndSorting } from "@/helper/fetchFromDirectus";
import Link from "next/link";

const FeaturedProductsBlock = async ({
  block,
}: {
  block: TFeaturedProductsBlock;
}) => {
  let products: TProduct[] = [];

  if (block.item.option === "manual") {
    products = block.item.products
      .filter((item) => item.products_id !== null)
      .map((item) => item.products_id);
  } else {
    products = await fetchProductsWithLimitAndSorting(
      block.item.limit || 8,
      block.item.sort_by || "most_popular",
      block.item.category?.slug
    );
  }

  return (
    <section className="py-10">
      <PaddingContainer>
        <h2 className="text-2xl md:text-3xl font-bold mb-8">
          {block.item.header_text || "Featured Products"}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <Link
          className="block mx-auto hover:bg-secondary hover:text-foreground  w-fit px-4 py-3  text-center mt-8 bg-primary text-background relative rounded-md font-semibold hover:shadow-lg transition"
          href={`${
            block.item.option === "manual"
              ? "/categories"
              : `/categories/${block.item.category.slug}`
          }`}
        >
          {" "}
          View All{" "}
          {block.item?.category?.name ? block.item?.category?.name : "Products"}
        </Link>
      </PaddingContainer>
    </section>
  );
};

export default FeaturedProductsBlock;
