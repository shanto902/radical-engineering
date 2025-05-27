"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Range, getTrackBackground } from "react-range";
import { TProduct } from "@/interfaces";
import ProductCard from "@/components/cards/ProductCard";

const STEP = 100;
const MIN = 0;
const MAX = 25000;

export default function ShopPage({ products }: { products: TProduct[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const [values, setValues] = useState([0, 25000]);
  const [categories, setCategories] = useState<
    { name: string; slug: string }[]
  >([]);

  // Extract slug from pathname like /categories/ips-ups-battery
  const categorySlug = pathname?.split("/")[2] || null;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error("Failed to load categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const filteredProducts = products.filter((p) => {
    const [minPrice, maxPrice] = values;
    const priceMatch = p.price >= minPrice && p.price <= maxPrice;
    const categoryMatch = categorySlug
      ? p.category.slug === categorySlug
      : true;
    return priceMatch && categoryMatch;
  });

  return (
    <section className="max-w-7xl mx-auto px-4 py-20">
      {/* Category Tabs */}
      <div className="flex gap-4 mb-6 flex-wrap font-bold">
        <button
          className={`px-4 py-2 rounded-full drop-shadow-sm ${
            !categorySlug ? "bg-primary text-white" : "text-gray-700"
          }`}
          onClick={() => router.push("/categories")}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => router.push(`/categories/${cat.slug}`)}
            className={`px-4 py-2 rounded-full  ${
              categorySlug === cat.slug
                ? "bg-primary text-white"
                : "text-gray-700"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <hr className="my-5" />
      {/* Filters & Product List */}
      <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-10">
        {/* Sidebar */}
        <aside>
          <h2 className="text-xl font-semibold mb-4">Filter by</h2>

          <div className="mb-8">
            <h3 className="text-md font-medium mb-4">Price Range (৳)</h3>
            <div className="mb-2 text-sm text-gray-600">
              {values[0].toLocaleString()}৳ – {values[1].toLocaleString()}৳
            </div>

            <Range
              values={values}
              step={STEP}
              min={MIN}
              max={MAX}
              onChange={(vals) => setValues(vals)}
              renderTrack={({ props, children }) => (
                <div
                  ref={props.ref}
                  onMouseDown={props.onMouseDown}
                  onTouchStart={props.onTouchStart}
                  style={{
                    ...props.style,
                    background: getTrackBackground({
                      values,
                      colors: ["#ccc", "#452819", "#ccc"],
                      min: MIN,
                      max: MAX,
                    }),
                  }}
                  className="h-2 rounded bg-gray-200"
                >
                  {children}
                </div>
              )}
              renderThumb={({ props, index }) => {
                const { key, ...thumbProps } = props; // remove `key`
                return (
                  <div
                    key={key ?? index} // apply key directly
                    {...thumbProps}
                    className="w-5 h-5 bg-primary rounded-full shadow outline-none"
                  />
                );
              }}
            />
          </div>
        </aside>

        {/* Products */}
        <main>
          <h1 className="text-2xl font-bold mb-6">Shop Products</h1>
          {filteredProducts.length === 0 ? (
            <p>No products match your filters.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </section>
  );
}
