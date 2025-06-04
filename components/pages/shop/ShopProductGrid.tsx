"use client";
import ProductCard from "@/components/cards/ProductCard";
import ProductCardSkeleton from "@/components/cards/ProductCardSkeleton";
import { isNativeApp } from "@/components/common/isNativeApp";
import { TProduct } from "@/interfaces";

type Props = {
  loading: boolean;
  products: TProduct[];
  totalProducts: number;
  lastItemRef?: (node: HTMLDivElement | null) => void;
};

const ProductGrid = ({
  loading,
  products,
  totalProducts,
  lastItemRef,
}: Props) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (totalProducts === 0) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-center space-y-4">
        <h2 className="text-xl font-semibold">Oops! No products found.</h2>
        <p className="text-foreground text-sm max-w-md">
          Try adjusting your filters or check back later. We’re always adding
          new items!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 mb-20">
      {products.map((product, index) => {
        const isLast = index === products.length - 1;
        return (
          <div
            key={product.id}
            ref={isLast && isNativeApp() ? lastItemRef : undefined}
          >
            <ProductCard product={product} />
          </div>
        );
      })}
    </div>
  );
};

export default ProductGrid;
