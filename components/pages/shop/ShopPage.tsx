"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usePathname } from "next/navigation";
import { RootState, AppDispatch } from "@/store";
import { fetchProducts, setProducts } from "@/store/productSlice";
import { TCategory, TProduct } from "@/interfaces";

import PaddingContainer from "@/components/common/PaddingContainer";
import PaginationControls from "./ShopPagination";
import FilterSidebar from "./ShopFiltersSidebar";
import CategoryTabs from "./ShopCategoryTabs";
import ProductGrid from "./ShopProductGrid";

import { isNativeApp } from "@/components/common/isNativeApp";
import useScrollRestore from "@/hooks/useScrollRestore";

const PRODUCTS_PER_PAGE = 8;
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

  const dispatch = useDispatch<AppDispatch>();

  const productsRaw = useSelector(
    (state: RootState) => state.products.itemsByCategory[categorySlug] || []
  );

  const reduxProducts = useMemo(() => productsRaw, [productsRaw]);
  const loading = useSelector((state: RootState) => state.products.loading);

  const [shouldRender, setShouldRender] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState<TProduct[]>([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>(
    []
  );
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const maxAvailablePrice = useMemo(() => {
    if (productsRaw.length === 0) return 500;
    const prices = productsRaw
      .map((p) => parseFloat(p.price))
      .filter((p) => !isNaN(p));
    return prices.length ? Math.max(...prices) : 500;
  }, [productsRaw]);

  const [priceRange, setPriceRange] = useState<[number, number]>([
    MIN,
    maxAvailablePrice,
  ]);

  useEffect(() => {
    setPriceRange([MIN, maxAvailablePrice]);
  }, [maxAvailablePrice]);

  useEffect(() => {
    if (initialProducts.length > 0) {
      dispatch(setProducts({ slug: categorySlug, products: initialProducts }));
    } else {
      dispatch(fetchProducts(categorySlug));
    }
  }, [dispatch, categorySlug, initialProducts]);

  useEffect(() => {
    if (initialProducts.length > 0 || reduxProducts.length > 0) {
      setShouldRender(true);
    }
  }, [initialProducts.length, reduxProducts.length]);

  useEffect(() => {
    const filtered = reduxProducts.filter((p) => {
      const matchCategory =
        categorySlug === "all" ? true : p.category?.slug === categorySlug;
      const matchSub = selectedSubcategories.length
        ? selectedSubcategories.includes(p.sub_category || "")
        : true;
      const matchBrand = selectedBrands.length
        ? selectedBrands.includes(p.brand?.name || "")
        : true;
      const matchPrice =
        parseFloat(p.price) >= priceRange[0] &&
        parseFloat(p.price) <= priceRange[1];
      return matchCategory && matchSub && matchBrand && matchPrice;
    });

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [
    reduxProducts,
    categorySlug,
    selectedSubcategories,
    selectedBrands,
    priceRange,
  ]);

  useScrollRestore("shop", [filteredProducts.length]);

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  const subcategories = useMemo(() => {
    return Array.from(
      new Set(
        reduxProducts
          .filter((p) => p.category?.slug === categorySlug && p.sub_category)
          .map((p) => p.sub_category!)
      )
    );
  }, [reduxProducts, categorySlug]);

  const brands = useMemo(() => {
    return Array.from(
      new Set(
        reduxProducts
          .filter((p) => {
            const matchCategory =
              categorySlug === "all" ? true : p.category?.slug === categorySlug;
            const matchSub = selectedSubcategories.length
              ? selectedSubcategories.includes(p.sub_category || "")
              : true;
            const matchPrice =
              parseFloat(p.price) >= priceRange[0] &&
              parseFloat(p.price) <= priceRange[1];
            return matchCategory && matchSub && matchPrice;
          })
          .map((p) => p.brand?.name)
          .filter(Boolean)
      )
    );
  }, [reduxProducts, categorySlug, selectedSubcategories, priceRange]);

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

  if (!shouldRender) {
    return (
      <PaddingContainer>
        <CategoryTabs categories={categories} />
        <ProductGrid loading={true} products={[]} totalProducts={0} />
      </PaddingContainer>
    );
  }

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

        <main>
          <ProductGrid
            loading={loading}
            products={isNativeApp() ? filteredProducts : paginatedProducts}
            totalProducts={filteredProducts.length}
          />

          {!isNativeApp() && (
            <PaginationControls
              currentPage={currentPage}
              totalPages={Math.ceil(
                filteredProducts.length / PRODUCTS_PER_PAGE
              )}
              onPageChange={setCurrentPage}
            />
          )}
        </main>
      </div>
    </PaddingContainer>
  );
}
