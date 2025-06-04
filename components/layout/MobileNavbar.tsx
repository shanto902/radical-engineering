"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ShoppingBag, Heart, Menu, Search, X } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { openCartSidebar } from "@/store/cartUISlice";
import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import Image from "next/image";
import { TProduct } from "@/interfaces";
import { fetchCategories } from "@/store/categorySlice";

export default function MobileNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const cartItems = useSelector((state: RootState) => state.cart.items);
  const { data: categories } = useSelector(
    (state: RootState) => state.categories
  );

  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);
  const [products, setProducts] = useState<TProduct[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const showBack = pathname !== "/home" && pathname !== "/";

  const handleBack = () => {
    const pathSegments = pathname.split("/").filter(Boolean);

    if (pathname === "/categories/all") {
      router.push("/home");
    } else if (pathSegments.length === 3 && pathSegments[0] === "categories") {
      router.push("/categories/all");
    } else {
      router.back();
    }
  };

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setProducts([]);
      return;
    }

    const fetchProducts = async () => {
      try {
        setSearchLoading(true);
        const res = await fetch(`/api/search?query=${debouncedQuery}`);
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setSearchLoading(false);
      }
    };

    fetchProducts();
  }, [debouncedQuery]);

  return (
    <>
      {/* 🔝 Top Bar */}
      <div className="mb-16">
        <div className="fixed top-0 left-0 right-0 z-50 h-14 bg-background dark:bg-darkBG border-b shadow-sm flex items-center justify-between px-4">
          {showBack ? (
            <button onClick={handleBack} aria-label="Go back">
              <ArrowLeft className="h-6 w-6 text-primary" />
            </button>
          ) : (
            <div className="w-6" />
          )}

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
              Radical Engineering
            </Link>
          )}

          <div className="flex items-center gap-3">
            <button
              onClick={() => setSearchOpen((p) => !p)}
              aria-label="Search"
            >
              {searchOpen ? (
                <X className="w-6 h-6 text-primary" />
              ) : (
                <Search className="w-6 h-6 text-primary" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 🔍 Search Results */}
      {searchOpen && query && (
        <div className="fixed z-50 top-14 left-0 right-0 bg-background border-b max-h-[60vh] overflow-y-auto shadow">
          {searchLoading ? (
            <div className="p-4 text-center text-sm">Searching...</div>
          ) : products.length > 0 ? (
            products.slice(0, 8).map((item) => (
              <Link
                key={item.slug}
                href={`/categories/${item.category.slug}/${item.slug}`}
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

      {/* 📂 Categories List Drawer */}
      {/* Category Drawer Overlay */}
      {showCategories && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setShowCategories(false)}
            className="fixed inset-0  bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300"
          />

          {/* Category Drawer */}
          <div className="fixed bottom-0 pb-20 left-0 right-0 bg-background z-50 border-t shadow-md px-4 py-4 animate-slide-up">
            <h3 className="text-lg font-semibold mb-3 text-center">
              Categories
            </h3>

            {/* All Products Link */}
            <Link
              href="/categories"
              onClick={() => setShowCategories(false)}
              className="mb-3 block rounded-lg border px-3 py-2 text-center text-sm font-medium hover:bg-secondary"
            >
              🛒 All Products
            </Link>

            <div className="grid grid-cols-2 gap-3">
              {categories.map((cat) => (
                <Link
                  href={`/categories/${cat.slug}`}
                  key={cat.slug}
                  onClick={() => setShowCategories(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg border hover:bg-secondary"
                >
                  <div className="w-8 h-8 bg-white border rounded-full flex items-center justify-center">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_ASSETS_URL}${cat.image}`}
                      alt={cat.name}
                      width={32}
                      height={32}
                      className="rounded-full object-contain"
                    />
                  </div>
                  <span className="text-sm font-medium">{cat.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ⬇️ Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 h-14 bg-background dark:bg-darkBG border-t shadow flex justify-around items-center">
        <button
          onClick={() => setShowCategories((prev) => !prev)}
          aria-label="Categories"
        >
          <Menu className="h-6 w-6 text-primary" />
        </button>

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
    </>
  );
}
