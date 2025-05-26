"use client";

import Image from "next/image";
import { Star } from "lucide-react";

const products = [
  {
    id: 1,
    title: "Longi Horizon Solar Panel 225W 12v",
    category: "SOLAR PANEL",
    image:
      "https://images.unsplash.com/photo-1584270354949-1e0f0b5a9d9a?auto=format&fit=crop&w=600&q=80",
    oldPrice: 9000,
    price: 7875,
    discount: "-13%",
    rating: 5,
    inStock: true,
  },
  {
    id: 2,
    title: "Mono Solar Panel 150W 12v High",
    category: "SOLAR PANEL",
    image:
      "https://images.unsplash.com/photo-1596495577886-d920f1fb7238?auto=format&fit=crop&w=600&q=80",
    oldPrice: 6750,
    price: 6412.5,
    discount: "-5%",
    rating: 5,
    inStock: true,
  },
  {
    id: 3,
    title: "REC 370 watt Solar panel 24v",
    category: "SOLAR PANEL",
    image:
      "https://images.unsplash.com/photo-1584270354949-1e0f0b5a9d9a?auto=format&fit=crop&w=600&q=80",
    oldPrice: 19500,
    price: 17550,
    discount: "-10%",
    rating: 5,
    inStock: true,
  },
  {
    id: 4,
    title: "REC TwinPeak 4 375W Solar Panel",
    category: "SOLAR PANEL",
    image:
      "https://images.unsplash.com/photo-1581091012184-7e0cdfbb679b?auto=format&fit=crop&w=600&q=80",
    oldPrice: 25000,
    price: 22500,
    discount: "-10%",
    rating: 5,
    inStock: true,
  },
];

export default function ProductGrid() {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-8">
          Featured Solar Panels
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white border rounded-xl shadow hover:shadow-md transition overflow-hidden"
            >
              <div className="relative">
                <Image
                  src={product.image}
                  alt={product.title}
                  width={400}
                  height={400}
                  className="w-full h-60 object-cover"
                />
                <span className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded-full font-semibold">
                  {product.discount}
                </span>
              </div>

              <div className="p-4">
                <h3 className="text-sm font-bold mb-1">{product.title}</h3>
                <p className="text-xs text-gray-500 mb-2">{product.category}</p>

                <div className="flex items-center text-yellow-400 text-sm mb-1">
                  {Array.from({ length: product.rating }).map((_, idx) => (
                    <Star key={idx} fill="currentColor" className="w-4 h-4" />
                  ))}
                </div>

                <p className="flex items-center text-primary text-sm font-semibold mb-1">
                  ✔ In stock
                </p>

                <div className="mb-3">
                  <span className="line-through text-gray-400 text-sm mr-2">
                    {product.oldPrice.toLocaleString()}৳
                  </span>
                  <span className="text-green-600 font-bold text-lg">
                    {product.price.toLocaleString()}৳
                  </span>
                </div>

                <button className="w-full bg-primary hover:bg-yellow-400 text-white hover:text-black text-sm py-2 rounded-lg font-semibold transition">
                  Add To Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
