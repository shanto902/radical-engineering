"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { useInView } from "react-intersection-observer";

import { TCategory, TProduct } from "@/interfaces";
import PaddingContainer from "@/components/common/PaddingContainer";
import FilterSidebar from "./ShopFiltersSidebar";
import CategoryTabs from "./ShopCategoryTabs";
import ProductGrid from "./ShopProductGrid";
import { isNativeApp } from "@/components/common/isNativeApp";
import useScrollRestore from "@/hooks/useScrollRestore";

const PRODUCTS_PER_PAGE = 10;
const MIN = 0;

export default function ShopPage({
  categories,
  products: initialProducts,
}: {
  categories: TCategory[];
  products: TProduct[];
}) {
  const pathname = usePathname();
  const categorySlug = pathname?.split("/")[2] || "all";
  const productsRaw = useMemo(() => initialProducts, [initialProducts]);

  const [filteredProducts, setFilteredProducts] = useState<TProduct[]>([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>(
    []
  );
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number] | null>(null);

  const [visibleCount, setVisibleCount] = useState(PRODUCTS_PER_PAGE);
  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: false,
  });

  const maxAvailablePrice = useMemo(() => {
    if (productsRaw.length === 0) return 100;
    const prices = productsRaw
      .map((p) => parseFloat(p.price))
      .filter((p) => !isNaN(p));
    return prices.length ? Math.max(...prices) : 100;
  }, [productsRaw]);

  useEffect(() => {
    if (maxAvailablePrice > 0) {
      setPriceRange([MIN, maxAvailablePrice]);
    }
  }, [maxAvailablePrice]);

  useEffect(() => {
    if (priceRange === null) return;

    const filtered = productsRaw.filter((p) => {
      const matchCategory =
        categorySlug === "all" ? true : p.category?.slug === categorySlug;
      const matchSub = selectedSubcategories.length
        ? selectedSubcategories.includes(p.sub_category || "")
        : true;
      const matchBrand = selectedBrands.length
        ? selectedBrands.includes(p.brand?.name || "")
        : true;
      const price = parseFloat(p.price);
      const matchPrice = price >= priceRange[0] && price <= priceRange[1];
      return matchCategory && matchSub && matchBrand && matchPrice;
    });

    setFilteredProducts(filtered);
    setVisibleCount(PRODUCTS_PER_PAGE); // reset visible count on filter
  }, [
    productsRaw,
    categorySlug,
    selectedSubcategories,
    selectedBrands,
    priceRange,
  ]);

  useEffect(() => {
    if (inView && visibleCount < filteredProducts.length) {
      setVisibleCount((prev) => prev + PRODUCTS_PER_PAGE);
    }
  }, [inView, visibleCount, filteredProducts.length]);

  useScrollRestore("shop", [filteredProducts.length]);

  const subcategories = useMemo(() => {
    return Array.from(
      new Set(
        productsRaw
          .filter((p) => p.category?.slug === categorySlug && p.sub_category)
          .map((p) => p.sub_category!)
      )
    );
  }, [productsRaw, categorySlug]);

  const brands = useMemo(() => {
    return Array.from(
      new Set(productsRaw.map((p) => p.brand?.name).filter(Boolean))
    );
  }, [productsRaw]);

  const handleBrandChange = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const handleSubcategoryChange = (subcategory: string) => {
    setSelectedSubcategories((prev) =>
      prev.includes(subcategory)
        ? prev.filter((s) => s !== subcategory)
        : [...prev, subcategory]
    );
  };

  if (priceRange === null) {
    return (
      <PaddingContainer>
        <CategoryTabs categories={categories} />
        <ProductGrid loading={true} products={[]} totalProducts={0} />
      </PaddingContainer>
    );
  }

  const productsToRender = isNativeApp()
    ? filteredProducts
    : filteredProducts.slice(0, visibleCount);

  return (
    <PaddingContainer>
      <CategoryTabs categories={categories} />

      <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-10">
        <aside>
          <FilterSidebar
            categories={categories}
            subcategories={subcategories}
            selectedSubcategories={selectedSubcategories}
            onSubChange={handleSubcategoryChange}
            brands={brands}
            selectedBrands={selectedBrands}
            onBrandChange={handleBrandChange}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            maxPrice={maxAvailablePrice}
          />
        </aside>

        <main className="mt-5 md:mt-0">
          <ProductGrid
            loading={false}
            products={productsToRender}
            totalProducts={filteredProducts.length}
          />

          {!isNativeApp() && visibleCount < filteredProducts.length && (
            <div
              ref={ref}
              className="text-center my-8 text-muted-foreground text-sm"
            >
              Loading more products...
            </div>
          )}
        </main>
      </div>
    </PaddingContainer>
  );
}
