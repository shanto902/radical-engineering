"use client";

import { useEffect, useState } from "react";
import {
  Menu,
  X,
  ChevronDown,
  Search,
  ShoppingBag,
  Heart,
  ArrowRightCircle,
  Cog,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";
import Image from "next/image";
import logoDark from "@/assets/logo-dark.svg";
import { TMenu, TProduct, TSettings } from "@/interfaces";

import CartPopup from "./header/CartPopup";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { useDebounce } from "@/hooks/useDebounce"; // ✅ import hook

import logo from "@/assets/logo.svg";
import { ThemeToggle } from "../ThemeToggle";
import BreadcrumbBanner from "../common/BreadCrumb";

import { openCartSidebar } from "@/store/cartUISlice";
import TopBar from "./header/TopBar";
import PaddingContainer from "../common/PaddingContainer";
import { closeMenu, toggleMenu } from "@/store/uiSlice";

const Navbar = ({ settings }: { settings: TSettings }) => {
  const dispatch = useDispatch<AppDispatch>(); // ✅ Typed dispatch

  const pathname = usePathname();
  const router = useRouter();
  const [categories, setCategories] = useState<
    { name: string; slug: string; image?: string }[]
  >([]);
  const menuOpen = useSelector((state: RootState) => state.ui.menuOpen);
  const [hoveringMenu, setHoveringMenu] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState<number>(-1); // -1 means nothing selected
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const [hideTopBar, setHideTopBar] = useState(false);
  const [products, setProducts] = useState<TProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const debouncedQuery = useDebounce(query, 300);
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

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

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setProducts([]);
      return;
    }

    const fetchProducts = async () => {
      try {
        setLoadingProducts(true);
        const res = await fetch(
          `/api/search?query=${encodeURIComponent(debouncedQuery)}`
        );
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        if (
          typeof err === "object" &&
          err !== null &&
          "name" in err &&
          (err as { name: string }).name !== "AbortError"
        ) {
          console.error("Search failed", err);
        }
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, [debouncedQuery]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setHideTopBar(true);
      } else {
        setHideTopBar(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const theme = useSelector((state: RootState) => state.theme.mode);
  const filteredSuggestions = products;

  useEffect(() => {
    setActiveIndex(-1);
  }, [query]);

  const renderSubMenuItems = (navItem: TMenu) => {
    const isDynamicCategoryMenu = navItem.sub_menu?.some(
      (s) => s.categories === true
    );

    if (isDynamicCategoryMenu) {
      return categories?.map((cat, i) => (
        <Link
          key={i}
          aria-label="Go to products page"
          href={`/categories/${cat.slug}`}
          className="flex items-center gap-3 p-2 rounded-lg transition-all hover:bg-secondary hover:text-primary group"
        >
          {cat.image && hasMounted && (
            <Image
              src={`${process.env.NEXT_PUBLIC_ASSETS_URL}${cat.image}?width=50&height=50`}
              placeholder="blur"
              blurDataURL={`${process.env.NEXT_PUBLIC_ASSETS_URL}${cat.image}?width=10&quality=1`}
              alt={cat.name}
              width={50}
              height={50}
              className="w-8 h-8 object-cover rounded"
            />
          )}
          <span className="text-sm font-medium  group-hover:text-foreground">
            {cat.name}
          </span>
        </Link>
      ));
    }

    return navItem.sub_menu?.map((submenu, i: number) => (
      <Link
        aria-label={"Got to menu item"}
        key={i}
        href={submenu.link || "#"}
        className="text-sm font-medium text-gray-700 hover:text-primary hover:pl-2 transition-all duration-200 border-l-2 border-transparent hover:border-primary pl-2"
      >
        {submenu.label}
      </Link>
    ));
  };

  return (
    <>
      <div
        className={`w-full safe-top text-sm text-center transition-all duration-300 ${
          hideTopBar
            ? "-translate-y-full opacity-0"
            : "translate-y-0 opacity-100"
        }`}
      >
        <TopBar settings={settings} />
      </div>
      <PaddingContainer>
        <hr className=" hidden  md:block" />
      </PaddingContainer>
      <nav className="backdrop-blur-lg bg-backgroundLight/80 h-[72px] dark:bg-backgroundDark/80    sticky top-0 transition-all duration-300 w-full z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/">
            {hasMounted && (
              <Image
                src={theme === "light" ? logo : logoDark}
                alt="Logo"
                className="h-12 object-contain w-fit rounded-md"
              />
            )}
          </Link>

          {/* Searchbar */}
          <div className="hidden md:block w-1/3 relative">
            <div className="relative">
              <input
                aria-label={`Go to Search Page`}
                type="text"
                placeholder="Search products..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  const maxIndex =
                    filteredSuggestions.length > 5
                      ? 5
                      : filteredSuggestions.length - 1;

                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setActiveIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
                  } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setActiveIndex((prev) => (prev > 0 ? prev - 1 : maxIndex));
                  } else if (e.key === "Enter") {
                    e.preventDefault();

                    if (activeIndex >= 0 && activeIndex < 5) {
                      const selectedItem = filteredSuggestions[activeIndex];
                      router.push(
                        `/categories/${selectedItem.category.slug}/${selectedItem.slug}`
                      );
                    } else if (activeIndex === 5) {
                      router.push(`/search?query=${encodeURIComponent(query)}`);
                    } else if (query.trim()) {
                      router.push(`/search?query=${encodeURIComponent(query)}`);
                    }

                    setQuery("");
                    dispatch(closeMenu());
                    setActiveIndex(-1);
                  }
                }}
                className="w-full border bg-background   rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Search
                className="absolute left-3 top-2.5 text-gray-400 "
                size={18}
              />
            </div>
            {query && (
              <div className="absolute top-full border left-0 right-0 bg-background mt-1 rounded-lg z-10">
                {loadingProducts ? (
                  <div className="flex items-center justify-center py-4">
                    <div className="w-6 h-6 border-2 border-t-2 border-primary rounded-full animate-spin" />
                    <span className="ml-2 text-sm text-foreground">
                      Searching...
                    </span>
                  </div>
                ) : filteredSuggestions.length > 0 ? (
                  <>
                    {filteredSuggestions.slice(0, 5)?.map((item, idx) => (
                      <Link
                        aria-label={`Go to ${item.name} Product Page`}
                        key={idx}
                        href={`/categories/${item.category.slug}/${item.slug}`}
                        className={clsx(
                          "flex items-center gap-3 px-4 py-2 text-sm hover:bg-secondary hover:text-foreground m-1 rounded-md cursor-pointer",
                          idx === activeIndex && "bg-primary text-background"
                        )}
                        onClick={() => {
                          setQuery("");
                          dispatch(closeMenu());
                          setActiveIndex(-1);
                        }}
                      >
                        <Image
                          src={`${process.env.NEXT_PUBLIC_ASSETS_URL}${item.image}?width=40&height=40`}
                          alt={item.name}
                          placeholder="blur"
                          blurDataURL={`${process.env.NEXT_PUBLIC_ASSETS_URL}${item.image}?width=10&quality=1`}
                          width={40}
                          height={40}
                          className="w-10 h-10 object-cover rounded"
                        />
                        <span>{item.name}</span>
                      </Link>
                    ))}
                    {filteredSuggestions.length > 5 && (
                      <Link
                        aria-label={`Go to Search Page`}
                        href={`/search?query=${encodeURIComponent(query)}`}
                        className={clsx(
                          "flex justify-between items-center px-4 py-2 text-sm font-semibold text-primary hover:underline",
                          activeIndex === 5 &&
                            "underline font-bold underline-offset-4 text-foreground"
                        )}
                        onClick={() => {
                          setQuery("");
                          dispatch(closeMenu());
                          setActiveIndex(-1);
                        }}
                      >
                        See more results for “{query}”
                        <ArrowRightCircle
                          className={`${
                            activeIndex === 5
                              ? "opacity-100 translate-x-0 transition-all duration-200"
                              : "opacity-0 -translate-x-14"
                          }`}
                        />
                      </Link>
                    )}
                  </>
                ) : (
                  <div className="px-4 py-2 text-sm text-gray-400">
                    No results found
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden  md:flex items-center gap-6">
            {settings.menu.map((navItem, i) =>
              navItem.sub_menu ? (
                <div
                  key={i}
                  className="relative"
                  onMouseEnter={() => setHoveringMenu(true)}
                  onMouseLeave={() => setHoveringMenu(false)}
                >
                  <Link
                    aria-label={`Go to ${navItem.label} Page`}
                    href={navItem.link}
                    className={clsx(
                      "flex items-center text-sm group font-medium text-foreground hover:text-primary transition",
                      pathname.startsWith(navItem.link || "")
                        ? "text-primary font-semibold"
                        : "text-foreground font-medium"
                    )}
                  >
                    {navItem.label}
                    <ChevronDown
                      size={16}
                      className={`ml-1 ${
                        hoveringMenu && "rotate-180"
                      } transition-all duration-200`}
                    />
                  </Link>

                  <div
                    className={clsx(
                      "absolute -right-20 top-full mt-3 w-[400px] bg-background  border  rounded-2xl  z-20 overflow-hidden transition-all font-semibold duration-300 ease-out transform",
                      hoveringMenu
                        ? "opacity-100 visible translate-y-0"
                        : "opacity-0 invisible -translate-y-2"
                    )}
                  >
                    <div className="p-2 grid grid-cols-2 gap-4">
                      {renderSubMenuItems(navItem)}
                    </div>
                    <Link
                      aria-label={`Go to Category Page`}
                      className="flex justify-center pb-2 pt-1 hover:bg-secondary bg-primary text-background hover:text-foreground text-sm border-t-2 dark:border-gray-700 w-full"
                      href={"/categories"}
                    >
                      View All Products
                    </Link>
                  </div>
                </div>
              ) : (
                <Link
                  key={i}
                  aria-label={`Go to ${navItem.label} Page`}
                  href={navItem.link || "#"}
                  className={clsx(
                    "text-sm hover:text-primary hover:underline transition-all duration-200 underline-offset-4",
                    pathname.startsWith(navItem.link || "")
                      ? "text-primary font-semibold"
                      : "text-foreground font-medium"
                  )}
                >
                  {navItem.label}
                </Link>
              )
            )}
            <ThemeToggle />

            {/* ❤️ Wishlist Icon */}
            <Link
              aria-label={`Toggle Whishlist`}
              href="/wishlist"
              title="Wishlist"
              className="text-foreground hover:text-primary transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.364l-7.682-7.682a4.5 4.5 0 010-6.364z"
                />
              </svg>
            </Link>

            {/* 🛒 Cart Button with Popup */}

            {/* Hover Popup */}
            <CartPopup />
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden ml-5 flex gap-3 items-center ">
            <button
              aria-label="Open Cart Sidebar"
              onClick={() => dispatch(openCartSidebar())}
            >
              {hasMounted && (
                <div className="relative">
                  <ShoppingBag />
                  {cartItems.length > 0 && (
                    <span
                      className="absolute -top-2 
left-3 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center "
                    >
                      {cartItems.length}
                    </span>
                  )}
                </div>
              )}
            </button>
            <ThemeToggle />
            <button
              aria-label="Toggle Mobile Menu"
              onClick={() => dispatch(toggleMenu())}
            >
              {menuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="fixed inset-x-0 top-[72px] h-screen  overflow-y-auto z-50 md:hidden backdrop-blur-lg bg-white dark:bg-backgroundDark px-4 pt-3 border-t shadow">
            <div className="mb-4 relative">
              <input
                aria-label="Got to search"
                type="text"
                placeholder="Search products..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && query.trim()) {
                    e.preventDefault();
                    router.push(`/search?query=${encodeURIComponent(query)}`);
                    setQuery("");
                    dispatch(closeMenu()); // optional
                  }
                }}
                className="w-full border bg-background rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary"
              />

              <Search
                className="absolute left-3 top-2.5 text-gray-400"
                size={18}
              />
              {query && (
                <div className="absolute top-full border left-0 right-0 bg-background mt-1 rounded-lg  z-10">
                  {filteredSuggestions.length > 0 ? (
                    <>
                      {filteredSuggestions.slice(0, 5)?.map((item, idx) => (
                        <Link
                          key={idx}
                          aria-label={`Got to ${item.name} Product Page`}
                          href={`/categories/${item.category.slug}/${item.slug}`}
                          className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-secondary hover:text-foreground m-1 rounded-md cursor-pointer"
                          onClick={() => setQuery("")}
                        >
                          <Image
                            src={`${process.env.NEXT_PUBLIC_ASSETS_URL}${item.image}?width=40&height=40`}
                            alt={item.name}
                            placeholder="blur"
                            blurDataURL={`${process.env.NEXT_PUBLIC_ASSETS_URL}${item.image}?width=10&quality=1`}
                            width={40}
                            height={40}
                            className="w-10 h-10 object-cover rounded"
                          />
                          <span>{item.name}</span>
                        </Link>
                      ))}
                      {filteredSuggestions.length > 5 && (
                        <Link
                          aria-label={`Go to Search Page`}
                          href={`/search?query=${encodeURIComponent(query)}`}
                          className="block px-4 py-2 text-sm text-primary hover:underline font-semibold"
                          onClick={() => setQuery("")}
                        >
                          See more results for “{query}”
                        </Link>
                      )}
                    </>
                  ) : (
                    <div className="px-4 py-2 text-sm text-gray-400">
                      No results found
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="overflow-y-auto max-h-[calc(100vh-180px)] mb-4">
              {settings.menu?.map((navItem, i) => {
                const isDynamicCategoryMenu = navItem.sub_menu?.some(
                  (s) => s.categories === true
                );
                const submenuItems = isDynamicCategoryMenu
                  ? categories?.map((cat) => ({
                      label: cat.name,
                      link: `/categories/${cat.slug}`,
                    }))
                  : navItem.sub_menu;

                return (
                  <div key={i} className="mb-1">
                    <Link
                      href={navItem.link || "#"}
                      aria-label={`Go to ${navItem.label} Page`}
                      onClick={() => dispatch(closeMenu())}
                      className={`block py-2 text-base font-medium transition hover:text-primary ${
                        pathname === navItem.link
                          ? "text-primary"
                          : "text-foreground"
                      }`}
                    >
                      {navItem.label}
                    </Link>

                    {submenuItems?.map((item, idx: number) => (
                      <Link
                        aria-label={`Go to ${item.label} Page`}
                        key={idx}
                        href={item.link}
                        onClick={() => dispatch(closeMenu())}
                        className="block pl-4 py-2 text-base text-foreground hover:text-primary"
                      >
                        {item.label}
                      </Link>
                    ))}
                    {isDynamicCategoryMenu && (
                      <Link
                        className="block pl-4 py-2 text-base text-foreground hover:text-primary"
                        href={"/categories"}
                        onClick={() => dispatch(closeMenu())}
                      >
                        View All Products
                      </Link>
                    )}
                  </div>
                );
              })}
              <Link
                href={"/order-tracker"}
                className="block py-2 text-base text-foreground hover:text-primary"
                onClick={() => dispatch(closeMenu())}
              >
                Track Order
              </Link>
              <div className="flex flex-wrap items-center  gap-4 w-full mb-20">
                <Link
                  href="/wishlist"
                  aria-label={`Go to Whishlist Page`}
                  onClick={() => dispatch(closeMenu())}
                  className=" text-center mt-3  bg-primary text-background relative py-3 w-fit px-4 rounded-full flex items-center gap-2  font-semibold hover:shadow-lg transition"
                >
                  <Heart /> View Wishlist
                </Link>

                <Link
                  href="/builder"
                  aria-label={`Go to System Builder Page`}
                  onClick={() => dispatch(closeMenu())}
                  className=" text-center mt-3  bg-primary text-background relative py-3 w-fit px-4 rounded-full flex items-center gap-2  font-semibold hover:shadow-lg transition"
                >
                  <Cog /> System Builder
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      <BreadcrumbBanner />
    </>
  );
};

export default Navbar;
