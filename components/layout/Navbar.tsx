"use client";

import { useEffect, useState } from "react";
import { Menu, X, ChevronDown, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import Image from "next/image";

import { TMenu, TSettings } from "@/interfaces";

import CartPopup from "./header/CartPopup";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

const dummySuggestions = [
  "Solar Panel 500W",
  "Lithium Battery",
  "Inverter 1000VA",
  "Street Light LED",
  "Solar Charger",
];

const Navbar = ({ settings }: { settings: TSettings }) => {
  const [categories, setCategories] = useState<
    { name: string; slug: string; image?: string }[]
  >([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hoveringMenu, setHoveringMenu] = useState(false);
  const [query, setQuery] = useState("");
  const pathname = usePathname();

  const cartItems = useSelector((state: RootState) => state.cart.items);

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

  const filteredSuggestions = dummySuggestions.filter((item) =>
    item.toLowerCase().includes(query.toLowerCase())
  );

  const renderSubMenuItems = (navItem: TMenu) => {
    const isDynamicCategoryMenu = navItem.sub_menu?.some(
      (s) => s.categories === true
    );

    if (isDynamicCategoryMenu) {
      return categories.map((cat, i) => (
        <Link
          key={i}
          href={`/categories/${cat.slug}`}
          className="flex items-center gap-3 p-2 rounded-lg transition-all hover:bg-primary/20 hover:text-primary group"
        >
          {cat.image && (
            <Image
              src={`${process.env.NEXT_PUBLIC_ASSETS_URL}${cat.image}`}
              alt={cat.name}
              width={32}
              height={32}
              className="w-8 h-8 object-contain rounded"
            />
          )}
          <span className="text-sm font-medium text-gray-700 group-hover:text-primary">
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
    <nav className="backdrop-blur-lg bg-white/80 shadow-sm fixed top-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link
          href="/home"
          className="text-2xl font-extrabold text-primary tracking-tight"
        >
          RADICAL ENGINEERING
        </Link>

        {/* Searchbar */}
        <div className="hidden md:block w-1/3 relative">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full border border-gray-300 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={18}
            />
          </div>
          {query && (
            <div className="absolute top-full left-0 right-0 bg-white border mt-1 rounded-lg shadow z-10">
              {filteredSuggestions.length > 0 ? (
                filteredSuggestions.map((item, idx) => (
                  <div
                    key={idx}
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                    onClick={() => setQuery(item)}
                  >
                    {item}
                  </div>
                ))
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
                    "flex items-center text-sm group font-medium text-gray-700 hover:text-primary transition",
                    pathname.startsWith(navItem.link || "")
                      ? "text-primary font-semibold"
                      : "text-gray-600 font-medium"
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
                    "absolute left-0 top-full mt-3 w-[400px] bg-white border rounded-2xl shadow-xl overflow-hidden transition-all font-semibold duration-300 ease-out transform",
                    hoveringMenu
                      ? "opacity-100 visible translate-y-0"
                      : "opacity-0 invisible -translate-y-2"
                  )}
                >
                  <div className="p-2 grid grid-cols-2 gap-4">
                    {renderSubMenuItems(navItem)}
                  </div>
                  <Link
                    className="flex justify-center pb-2 pt-1 hover:bg-primary/20 text-sm border-t-2 w-full"
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
                    : "text-gray-600 font-medium"
                )}
              >
                {navItem.label}
              </Link>
            )
          )}

          {/* ❤️ Wishlist Icon */}
          <Link
            href="/wishlist"
            title="Wishlist"
            className="text-gray-600 hover:text-primary transition"
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
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
            {isOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-4 pt-3 pb-6 bg-white border-t shadow">
          <div className="mb-4 relative">
            <input
              type="text"
              placeholder="Search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full border rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={18}
            />
            {query && (
              <div className="absolute top-full left-0 right-0 bg-white border mt-1 rounded-lg shadow z-10">
                {filteredSuggestions.length > 0 ? (
                  filteredSuggestions.map((s, idx) => (
                    <div
                      key={idx}
                      className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setQuery(s);
                        setIsOpen(false);
                      }}
                    >
                      {s}
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-2 text-sm text-gray-400">
                    No results found
                  </div>
                )}
              </div>
            )}
          </div>

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
                  className={`block py-2 text-sm font-medium transition hover:text-primary ${
                    pathname === navItem.link ? "text-primary" : "text-gray-700"
                  }`}
                >
                  {navItem.label}
                </Link>

                {submenuItems?.map((item, idx: number) => (
                  <Link
                    key={idx}
                    href={item.link}
                    onClick={() => setIsOpen(false)}
                    className="block pl-4 py-1 text-sm text-gray-500 hover:text-primary"
                  >
                    {item.label}
                  </Link>
                ))}
                {isDynamicCategoryMenu && (
                  <Link
                    className="block pl-4 py-1 text-sm text-gray-500 hover:text-primary"
                    href={"/categories"}
                  >
                    View All Products
                  </Link>
                )}
              </div>
            );
          })}

          <Link
            href="/cart"
            onClick={() => setIsOpen(false)}
            className="block text-center mt-3 bg-primary text-white py-2 rounded-full font-semibold hover:shadow-lg transition"
          >
            {/* Badge */}
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
                {cartItems.length}
              </span>
            )}
            View Cart
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
