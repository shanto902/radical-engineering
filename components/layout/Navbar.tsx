"use client";

import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Products", href: "/shop", hasMegaMenu: true },
  { name: "Deals", href: "/deals" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

const productCategories = [
  { name: "Solar Panels", href: "/category/solar-panels" },
  { name: "Batteries", href: "/category/batteries" },
  { name: "Inverters", href: "/category/inverters" },
  { name: "Street Lights", href: "/category/street-lights" },
  { name: "Accessories", href: "/category/tools" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveringMenu, setHoveringMenu] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="bg-white shadow-md fixed top-0 w-full  z-50 flex items-center justify-between">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex w-full justify-between items-center">
        {/* Logo */}
        <Link
          href="/"
          className="text-3xl font-extrabold text-primary tracking-tight"
        >
          RADICAL ENGINEERING
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 relative">
          {navLinks.map((link) =>
            link.hasMegaMenu ? (
              <div
                key={link.name}
                className="relative"
                onMouseEnter={() => setHoveringMenu(true)}
                onMouseLeave={() => setHoveringMenu(false)}
              >
                <button className="flex items-center text-base font-medium text-gray-700 hover:text-primary transition">
                  {link.name}
                  <ChevronDown size={16} className="ml-1" />
                </button>

                {/* Mega Menu */}
                <div
                  className={clsx(
                    "absolute left-0 top-full mt-2 w-[500px] bg-white rounded-lg shadow-lg border p-6 grid grid-cols-2 gap-4 transition-all duration-200",
                    hoveringMenu ? "opacity-100 visible" : "opacity-0 invisible"
                  )}
                  onMouseEnter={() => setHoveringMenu(true)}
                  onMouseLeave={() => setHoveringMenu(false)}
                >
                  {productCategories.map((cat) => (
                    <Link
                      key={cat.name}
                      href={cat.href}
                      className="text-base text-gray-700 hover:text-primary transition"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                key={link.name}
                href={link.href}
                className={clsx(
                  "text-base font-medium transition hover:text-primary underline-offset-4 hover:underline",
                  pathname === link.href ? "text-primary" : "text-gray-600"
                )}
              >
                {link.name}
              </Link>
            )
          )}

          <Link
            href="/cart"
            className="ml-6 px-4 py-2 bg-primary hover:bg-yellow-400 hover:text-black transition-all duration-200 text-white rounded-full text-sm font-semibold shadow hover:shadow-lg"
          >
            View Cart
          </Link>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
            {isOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t shadow-md px-4 py-4 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`block text-base font-medium transition hover:text-primary ${
                pathname === link.href ? "text-primary" : "text-gray-700"
              }`}
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="/cart"
            onClick={() => setIsOpen(false)}
            className="block text-center mt-3 bg-primary text-white py-2 rounded-full font-semibold hover:shadow-lg transition"
          >
            View Cart
          </Link>
        </div>
      )}
    </nav>
  );
}
