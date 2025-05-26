"use client";

import Image from "next/image";
import { Facebook, Twitter, X, Linkedin, Eye, Heart } from "lucide-react";
import Link from "next/link";

export default function ProductPage() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-20 grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* Left Image + Badge */}
      <div className="relative">
        <Image
          src="https://images.unsplash.com/photo-1584270354949-1e0f0b5a9d9a?auto=format&fit=crop&w=600&q=80" // Replace with real image
          alt="Kstar Battery"
          width={600}
          height={600}
          className="rounded-xl w-full object-contain bg-gray-50"
        />
        <span className="absolute top-4 right-4 bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold">
          -13%
        </span>
      </div>

      {/* Right Info Panel */}
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        {/* Title */}
        <h1 className="text-2xl font-semibold mb-2">
          Kstar UPS Battery 12 Volt 7.5 Amp
        </h1>

        {/* Ratings + Price */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center text-yellow-400 text-sm font-medium">
            ★★★★★
            <span className="ml-2 text-sm text-gray-500">
              (1 customer review)
            </span>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center gap-4 mb-4">
          <span className="line-through text-gray-400 text-lg font-medium">
            ১,৫৫০.০০৳
          </span>
          <span className="text-green-600 text-2xl font-bold">১,৩৫০.০০৳</span>
          <span className="bg-red-100 text-red-500 text-xs font-semibold border border-red-400 px-3 py-1 rounded-full">
            ● Out of stock
          </span>
        </div>

        {/* Features */}
        <ul className="text-sm text-gray-700 mb-6 space-y-1 list-disc list-inside">
          <li>Back up Battery</li>
          <li>Volt: 12 Volt</li>
          <li>Amp: 7.5 Amp</li>
          <li>Good Quality</li>
        </ul>

        {/* Wishlist + Share */}
        <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
          <button className="flex items-center gap-2 hover:text-primary font-medium">
            <Heart className="w-4 h-4" />
            Add to wishlist
          </button>
          <div className="flex gap-3">
            <Link href="#" className="hover:text-blue-500">
              <Facebook size={16} />
            </Link>
            <Link href="#" className="hover:text-sky-400">
              <Twitter size={16} />
            </Link>
            <Link href="#" className="hover:text-black">
              <X size={16} />
            </Link>
            <Link href="#" className="hover:text-blue-600">
              <Linkedin size={16} />
            </Link>
          </div>
        </div>

        {/* Live Viewers */}
        <div className="bg-green-50 border border-green-100 text-green-700 px-4 py-2 rounded text-sm flex items-center gap-2">
          <Eye size={16} /> ১৮ জন এখন এই পণ্যটি দেখছেন!
        </div>
      </div>
    </section>
  );
}
