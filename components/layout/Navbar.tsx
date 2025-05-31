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
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import Image from "next/image";
import logoDark from "@/assets/logo-dark.svg";
import { TMenu, TSettings } from "@/interfaces";

import CartPopup from "./header/CartPopup";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchProducts } from "@/store/productSlice";
import logo from "@/assets/logo.svg";
import { ThemeToggle } from "../ThemeToggle";
import BreadcrumbBanner from "../common/BreadCrumb";

import { openCartSidebar } from "@/store/cartUISlice";
import TopBar from "./header/TopBar";
import PaddingContainer from "../common/PaddingContainer";
const Navbar = ({ settings }: { settings: TSettings }) => {
  const [categories, setCategories] = useState<
    { name: string; slug: string; image?: string }[]
  >([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hoveringMenu, setHoveringMenu] = useState(false);
  const [query, setQuery] = useState("");
  const pathname = usePathname();
  const [activeIndex, setActiveIndex] = useState<number>(-1); // -1 means nothing selected
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const [hasMounted, setHasMounted] = useState(false);
  const [hideTopBar, setHideTopBar] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

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
  const dispatch = useDispatch<AppDispatch>(); // ✅ Typed dispatch

  useEffect(() => {
    dispatch(fetchProducts()); // ✅ No more TS error
  }, []);

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

  const products = useSelector((state: RootState) => state.products.items);
  const theme = useSelector((state: RootState) => state.theme.mode);
  const filteredSuggestions = products.filter((item) =>
    item.name.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    setActiveIndex(-1);
  }, [query]);

  const renderSubMenuItems = (navItem: TMenu) => {
    const isDynamicCategoryMenu = navItem.sub_menu?.some(
      (s) => s.categories === true
    );

    if (isDynamicCategoryMenu) {
      return categories.map((cat, i) => (
        <Link
          key={i}
          href={`/categories/${cat.slug}`}
          className="flex items-center gap-3 p-2 rounded-lg transition-all hover:bg-secondary hover:text-primary group"
        >
          {cat.image && hasMounted && (
            <Image
              src={`${process.env.NEXT_PUBLIC_ASSETS_URL}${cat.image}`}
              alt={cat.name}
              width={32}
              height={32}
              className="w-8 h-8 object-contain rounded"
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
        className={`w-full text-sm text-center transition-all duration-300 ${
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
      <nav className="backdrop-blur-lg bg-white/80 h-[72px] dark:bg-backgroundDark/80    sticky top-0 transition-all duration-300 w-full z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/home">
            <Image
              src={theme === "light" ? logo : logoDark}
              alt="Logo"
              className="h-12 object-contain w-fit rounded-md"
              priority
            />
          </Link>

          {/* Searchbar */}
          <div className="hidden md:block w-1/3 relative">
            <div className="relative">
              <input
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
                      window.location.href = `/categories/${selectedItem.category.slug}/${selectedItem.slug}`;
                    } else if (activeIndex === 5) {
                      window.location.href = `/search?query=${encodeURIComponent(
                        query
                      )}`;
                    } else if (query.trim()) {
                      window.location.href = `/search?query=${encodeURIComponent(
                        query
                      )}`;
                    }

                    setQuery("");
                    setIsOpen(false);
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
              <div className="absolute top-full border left-0 right-0 bg-background mt-1 rounded-lg  z-10">
                {filteredSuggestions.length > 0 ? (
                  <>
                    {filteredSuggestions.slice(0, 5).map((item, idx) => (
                      <Link
                        key={idx}
                        href={`/categories/${item.category.slug}/${item.slug}`}
                        className={clsx(
                          "flex items-center gap-3 px-4 py-2 text-sm hover:bg-secondary hover:text-foreground m-1 rounded-md cursor-pointer",
                          idx === activeIndex && "bg-primary text-background"
                        )}
                        onClick={() => {
                          setQuery("");
                          setIsOpen(false);
                          setActiveIndex(-1);
                        }}
                      >
                        <Image
                          src={`${process.env.NEXT_PUBLIC_ASSETS_URL}${item.image}`}
                          alt={item.name}
                          width={40}
                          height={40}
                          className="w-10 h-10 object-cover rounded"
                        />
                        <span>{item.name}</span>
                      </Link>
                    ))}

                    {/* See more option (navigable with index 5) */}
                    {filteredSuggestions.length > 5 && (
                      <Link
                        href={`/search?query=${encodeURIComponent(query)}`}
                        className={clsx(
                          "flex justify-between items-center px-4 py-2  text-sm font-semibold text-primary hover:underline",
                          activeIndex === 5 &&
                            "underline font-bold underline-offset-4 text-foreground"
                        )}
                        onClick={() => {
                          setQuery("");
                          setIsOpen(false);
                          setActiveIndex(-1);
                        }}
                      >
                        See more results for “{query}”{" "}
                        <ArrowRightCircle
                          className={` ${
                            activeIndex === 5
                              ? "opacity-100   translate-x-0  transition-all duration-200"
                              : "opacity-0 -translate-x-14 "
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
                      "absolute left-0 top-full mt-3 w-[400px] bg-background  border  rounded-2xl  z-20 overflow-hidden transition-all font-semibold duration-300 ease-out transform",
                      hoveringMenu
                        ? "opacity-100 visible translate-y-0"
                        : "opacity-0 invisible -translate-y-2"
                    )}
                  >
                    <div className="p-2 grid grid-cols-2 gap-4">
                      {renderSubMenuItems(navItem)}
                    </div>
                    <Link
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
            </button>
            <ThemeToggle />
            <button
              aria-label="Toggle Mobile Menu"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="fixed inset-x-0 top-[72px] z-50 md:hidden backdrop-blur-lg bg-white/80 dark:bg-backgroundDark/80 px-4 pt-3 pb-6 border-t shadow">
            <div className="mb-4 relative">
              <input
                type="text"
                placeholder="Search products..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && query.trim()) {
                    e.preventDefault();
                    window.location.href = `/search?query=${encodeURIComponent(
                      query
                    )}`;
                    setQuery("");
                    setIsOpen(false); // optional
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
                      {filteredSuggestions.slice(0, 5).map((item, idx) => (
                        <Link
                          key={idx}
                          href={`/categories/${item.category.slug}/${item.slug}`}
                          className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-secondary hover:text-foreground m-1 rounded-md cursor-pointer"
                          onClick={() => setQuery("")}
                        >
                          <Image
                            src={`${process.env.NEXT_PUBLIC_ASSETS_URL}${item.image}`}
                            alt={item.name}
                            width={40}
                            height={40}
                            className="w-10 h-10 object-cover rounded"
                          />
                          <span>{item.name}</span>
                        </Link>
                      ))}
                      {filteredSuggestions.length > 5 && (
                        <Link
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

            <div className="overflow-y-auto max-h-[calc(100vh-200px)] mb-4">
              {settings.menu.map((navItem, i) => {
                const isDynamicCategoryMenu = navItem.sub_menu?.some(
                  (s) => s.categories === true
                );
                const submenuItems = isDynamicCategoryMenu
                  ? categories.map((cat) => ({
                      label: cat.name,
                      link: `/categories/${cat.slug}`,
                    }))
                  : navItem.sub_menu;

                return (
                  <div key={i} className="mb-1">
                    <Link
                      href={navItem.link || "#"}
                      onClick={() => setIsOpen(false)}
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
                        key={idx}
                        href={item.link}
                        onClick={() => setIsOpen(false)}
                        className="block pl-4 py-2 text-base text-foreground hover:text-primary"
                      >
                        {item.label}
                      </Link>
                    ))}
                    {isDynamicCategoryMenu && (
                      <Link
                        className="block pl-4 py-2 text-base text-foreground hover:text-primary"
                        href={"/categories"}
                      >
                        View All Products
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex items-center gap-4 w-full">
              <Link
                href="/wishlist"
                onClick={() => setIsOpen(false)}
                className=" text-center mt-3 bg-primary text-background relative py-3 w-fit px-4 rounded-full flex items-center gap-2  font-semibold hover:shadow-lg transition"
              >
                <Heart /> View Wishlist
              </Link>
            </div>
          </div>
        )}
      </nav>
      <BreadcrumbBanner />
    </>
  );
};

export default Navbar;
