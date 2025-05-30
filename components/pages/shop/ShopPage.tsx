"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import { RootState, AppDispatch } from "@/store";
import { fetchProducts, setProducts } from "@/store/productSlice";
import { TCategory, TProduct } from "@/interfaces";
import ProductCard from "@/components/cards/ProductCard";
import PaddingContainer from "@/components/common/PaddingContainer";
import { Range, getTrackBackground } from "react-range";

import ProductCardSkeleton from "@/components/cards/ProductCardSkeleton";

const PRODUCTS_PER_PAGE = 8;
const STEP = 100;
const MIN = 0;

export default function ShopPage({
  categories,
  products: initialProducts,
}: {
  categories: TCategory[];
  products: TProduct[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const categorySlug = pathname?.split("/")[2] || null;

  const dispatch = useDispatch<AppDispatch>();
  const { items: products, loading } = useSelector(
    (state: RootState) => state.products
  );

  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>(
    []
  );
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

  const maxAvailablePrice = useMemo(() => {
    if (products.length === 0) return 1000; // fallback
    return Math.max(...products.map((p) => p.price));
  }, [products]);

  const [priceRange, setPriceRange] = useState<[number, number]>([MIN, 100]);
  useEffect(() => {
    setPriceRange([MIN, maxAvailablePrice]);
  }, [maxAvailablePrice]);

  const [currentPage, setCurrentPage] = useState(1);
  const [filteredProducts, setFilteredProducts] = useState<TProduct[]>([]);

  // ─── Fetch Products on Mount ───────────────────────────────────
  // in ShopPage.tsx
  useEffect(() => {
    if (initialProducts.length > 0) {
      dispatch(setProducts(initialProducts)); // ← dispatch to redux on first load
    } else {
      dispatch(fetchProducts(categorySlug || undefined)); // fallback
    }
  }, [dispatch, categorySlug]);

  // ─── Filter Logic ──────────────────────────────────────────────
  useEffect(() => {
    const filtered = products.filter((p) => {
      const matchCategory = categorySlug
        ? p.category?.slug === categorySlug
        : true;
      const matchSub =
        selectedSubcategories.length > 0
          ? selectedSubcategories.includes(p.sub_category || "")
          : true;
      const matchBrand =
        selectedBrands.length > 0
          ? selectedBrands.includes(p.brand?.name || "")
          : true;
      const matchPrice = p.price >= priceRange[0] && p.price <= priceRange[1];

      return matchCategory && matchSub && matchBrand && matchPrice;
    });

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [
    products,
    categorySlug,
    selectedSubcategories,
    selectedBrands,
    priceRange,
  ]);

  // ─── Paginate Products ─────────────────────────────────────────
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  // ─── Derived Filters ───────────────────────────────────────────
  const subcategories = Array.from(
    new Set(
      products
        .filter((p) => p.category?.slug === categorySlug && p.sub_category)
        .map((p) => p.sub_category!)
    )
  );
  const brands = Array.from(
    new Set(
      products
        .filter((p) => {
          const matchCategory = categorySlug
            ? p.category?.slug === categorySlug
            : true;
          const matchSub =
            selectedSubcategories.length > 0
              ? selectedSubcategories.includes(p.sub_category || "")
              : true;
          const matchPrice =
            p.price >= priceRange[0] && p.price <= priceRange[1];

          return matchCategory && matchSub && matchPrice;
        })
        .map((p) => p.brand?.name)
        .filter(Boolean)
    )
  );

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

  return (
    <PaddingContainer className="py-20">
      {/* Category Tabs */}
      <div className="flex gap-4 flex-wrap font-bold mb-4">
        <button
          className={`px-4 py-2 rounded-full ${
            !categorySlug ? "bg-primary text-background" : "text-foreground"
          }`}
          onClick={() => router.push("/categories")}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => router.push(`/categories/${cat.slug}`)}
            className={`px-4 py-2 rounded-full ${
              categorySlug === cat.slug
                ? "bg-primary text-background"
                : "text-foreground"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>
      <hr className="mb-4" />
      <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-10">
        {/* Sidebar */}
        <aside className="px-4">
          {subcategories.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4">Subcategories</h3>
              <div className="space-y-2">
                {subcategories.map((sub) => (
                  <label
                    key={sub}
                    className="flex items-center space-x-2 text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={selectedSubcategories.includes(sub)}
                      onChange={() => handleSubcategoryChange(sub)}
                      className="accent-primary"
                    />
                    <span>{sub}</span>
                  </label>
                ))}
              </div>
              <hr className="border-primary/30 my-4" />
            </div>
          )}

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-4">Price Range (৳)</h3>
            <div className="text-sm  mb-2">
              {priceRange[0].toLocaleString()}৳ –{" "}
              {priceRange[1].toLocaleString()}৳
            </div>
            <Range
              values={priceRange}
              step={STEP}
              min={MIN}
              max={maxAvailablePrice}
              onChange={(vals) => setPriceRange(vals as [number, number])}
              renderTrack={({ props, children }) => (
                <div
                  ref={props.ref}
                  onMouseDown={props.onMouseDown}
                  onTouchStart={props.onTouchStart}
                  style={{
                    ...props.style,
                    background: getTrackBackground({
                      values: priceRange,
                      colors: ["#ccc", "#452819", "#ccc"],
                      min: MIN,
                      max: maxAvailablePrice,
                    }),
                  }}
                  className="h-1 rounded bg-foreground"
                >
                  {children}
                </div>
              )}
              renderThumb={({ props }) => (
                <div
                  {...props}
                  className="w-3 h-3 bg-primary rounded-full shadow"
                />
              )}
            />
          </div>
          <hr className="border-primary/30 my-4" />

          {brands.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4">Brands</h3>
              <div className="space-y-2">
                {brands.map((brand) => (
                  <label
                    key={brand}
                    className="flex items-center space-x-2 text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => handleBrandChange(brand)}
                      className="accent-primary"
                    />
                    <span>{brand}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* Product Grid */}
        <main>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="h-[60vh] flex flex-col items-center justify-center text-center space-y-4">
              <h2 className="text-xl font-semibold">
                Oops! No products found.
              </h2>
              <p className="text-gray-500 text-sm max-w-md">
                Try adjusting your filters or check back later. We’re always
                adding new items!
              </p>
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {paginatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {filteredProducts.length > PRODUCTS_PER_PAGE && (
                <div className="flex justify-center mt-8">
                  <div className="inline-flex gap-2">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 hover:bg-secondary border rounded disabled:opacity-50"
                    >
                      Previous
                    </button>
                    {Array.from({
                      length: Math.ceil(
                        filteredProducts.length / PRODUCTS_PER_PAGE
                      ),
                    }).map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentPage(idx + 1)}
                        className={`px-3 py-1 border rounded ${
                          currentPage === idx + 1
                            ? "bg-primary text-background"
                            : "hover:bg-secondary"
                        }`}
                      >
                        {idx + 1}
                      </button>
                    ))}
                    <button
                      onClick={() =>
                        setCurrentPage((p) =>
                          Math.min(
                            p + 1,
                            Math.ceil(
                              filteredProducts.length / PRODUCTS_PER_PAGE
                            )
                          )
                        )
                      }
                      disabled={
                        currentPage ===
                        Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE)
                      }
                      className="px-3 py-1 border hover:bg-secondary rounded disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </PaddingContainer>
  );
}
