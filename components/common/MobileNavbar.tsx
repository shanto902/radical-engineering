"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ShoppingBag,
  Heart,
  Menu,
  Package,
  Search,
  X,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { openCartSidebar } from "@/store/cartUISlice";
import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import Image from "next/image";
import { TProduct } from "@/interfaces";

export default function MobileNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const showBack = pathname !== "/home" && pathname !== "/";

  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // 🔍 fetch suggestions
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setProducts([]);
      return;
    }

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/search?query=${debouncedQuery}`);
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [debouncedQuery]);

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 h-14 bg-background dark:bg-darkBG border-b shadow-sm flex items-center justify-between px-4">
        {/* Back or Menu */}
        {showBack ? (
          <button onClick={() => router.back()} aria-label="Go back">
            <ArrowLeft className="h-6 w-6 text-primary" />
          </button>
        ) : (
          <button
            onClick={() => router.push("/categories")}
            aria-label="Browse categories"
          >
            <Menu className="h-6 w-6 text-primary" />
          </button>
        )}

        {/* Logo or Search Icon */}
        {searchOpen ? (
          <div className="flex-1 mx-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full border rounded-full py-1.5 px-4 text-sm bg-white dark:bg-black text-foreground"
              placeholder="Search products..."
              autoFocus
            />
          </div>
        ) : (
          <Link href="/home" className="text-lg font-semibold text-primary">
            Radical
          </Link>
        )}

        <div className="flex items-center gap-3">
          <button
            onClick={() => setSearchOpen((p) => !p)}
            aria-label="Toggle search"
          >
            {searchOpen ? (
              <X className="w-6 h-6 text-primary" />
            ) : (
              <Search className="w-6 h-6 text-primary" />
            )}
          </button>

          <Link href="/track-order" aria-label="Track Order">
            <Package className="h-6 w-6 text-primary" />
          </Link>
          <Link href="/wishlist" aria-label="Wishlist">
            <Heart className="h-6 w-6 text-primary" />
          </Link>
          <button onClick={() => dispatch(openCartSidebar())} aria-label="Cart">
            <div className="relative">
              <ShoppingBag className="h-6 w-6 text-primary" />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 left-3 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </div>
          </button>
        </div>
      </div>

      {/* Search Suggestions Dropdown */}
      {searchOpen && query && (
        <div className="fixed top-14 left-0 right-0 bg-background z-40 border-b max-h-[60vh] overflow-y-auto shadow">
          {loading ? (
            <div className="p-4 text-center text-sm">Searching...</div>
          ) : products.length > 0 ? (
            products.slice(0, 8).map((item: TProduct, idx) => (
              <Link
                href={`/categories/${item.category.slug}/${item.slug}`}
                key={idx}
                onClick={() => {
                  setQuery("");
                  setSearchOpen(false);
                }}
                className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-secondary hover:text-foreground"
              >
                <Image
                  src={`${process.env.NEXT_PUBLIC_ASSETS_URL}${item.image}?width=40&height=40`}
                  alt={item.name}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded object-cover"
                />
                <span>{item.name}</span>
              </Link>
            ))
          ) : (
            <div className="p-4 text-center text-sm text-gray-400">
              No results found
            </div>
          )}
        </div>
      )}
    </>
  );
}
