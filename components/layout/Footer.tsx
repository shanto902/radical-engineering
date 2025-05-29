import Link from "next/link";
import { Facebook, Phone, Mail, MapPin } from "lucide-react";
import Image from "next/image";
import logo from "@/assets/logo-square.svg"; // Adjust the path as necessary
export default function Footer() {
  return (
    <footer className="bg-primary text-white pt-10 pb-6">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo & Tagline */}
        <div>
          <Image
            src={logo}
            alt="Logo"
            className=" object-contain w-fit h-28"
            priority
          />
          <p className="mt-3 ml-1 text-sm text-gray-300">
            Powering your home with trusted solar and battery solutions.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>
              <Link href="/" className="hover:text-white">
                Home
              </Link>
            </li>
            <li>
              <Link href="/products" className="hover:text-white">
                Products
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-white">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-white">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Contact</h3>
          <ul className="space-y-2 text-sm text-gray-300">
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
      <div className="border-t border-white/10 mt-10 pt-4 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} Radical Engineering. All rights reserved.
      </div>
    </footer>
  );
}
