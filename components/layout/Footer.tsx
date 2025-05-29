"use client";
import Link from "next/link";
import { Facebook, Phone, Mail, MapPin } from "lucide-react";
import Image from "next/image";
import logo from "@/assets/logo-square.svg";
import logoDark from "@/assets/logo-square-dark.svg";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
export default function Footer() {
  const theme = useSelector((state: RootState) => state.theme.mode);
  return (
    <footer className="bg-primary text-background pt-10 pb-6">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo & Tagline */}
        <div>
          <Image
            src={theme === "light" ? logo : logoDark}
            alt="Logo"
            className=" object-contain w-fit h-28"
            priority
          />
          <p className="mt-3 ml-1 text-sm text-background">
            Powering your home with trusted solar and battery solutions.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm text-background">
            <li>
              <Link href="/" className="hover:underline">
                Home
              </Link>
            </li>
            <li>
              <Link href="/products" className="hover:underline">
                Products
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:underline">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:underline">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Contact</h3>
          <ul className="space-y-2 text-sm text-background">
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4" /> +880 1911-922109
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4" /> support@radicalengineering.com
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="w-4 h-4" /> Dhaka, Bangladesh
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Follow Us</h3>
          <div className="flex gap-4 mt-2">
            <Link
              href="https://facebook.com"
              target="_blank"
              className="p-2 bg-white/10 hover:bg-white/20 rounded-full"
            >
              <Facebook className="w-5 h-5" />
            </Link>
            {/* Add more icons as needed */}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-background mt-10 pt-4 text-center text-sm text-background">
        © {new Date().getFullYear()} Radical Engineering. All rights reserved.
      </div>
    </footer>
  );
}
