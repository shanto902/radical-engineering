"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ProductCard from "@/components/cards/ProductCard";
import { TProduct } from "@/interfaces";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query")?.toLowerCase() || "";

  const [products, setProducts] = useState<TProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query) return;

    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/search?query=${encodeURIComponent(query)}`
        );
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Failed to fetch search results", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-4">Search Results for “{query}”</h1>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="h-48 rounded bg-gray-200 animate-pulse" />
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {products.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      ) : (
        <p>No products found for “{query}”.</p>
      )}
    </div>
  );
}
