// components/PopularCategories.tsx
"use client";

import Image from "next/image";
import Link from "next/link";

const categories = [
  {
    title: "IPS / UPS BATTERY",
    image:
      "https://images.unsplash.com/photo-1581091012184-7e0cdfbb679b?auto=format&fit=crop&w=512&q=80",
    href: "/categories/battery",
  },
  {
    title: "HOME IPS",
    image:
      "https://images.unsplash.com/photo-1601134467661-3d7754b04e3c?auto=format&fit=crop&w=512&q=80",
    href: "/categories/home-ips",
  },
  {
    title: "SOLAR IPS",
    image:
      "https://images.unsplash.com/photo-1596495577886-d920f1fb7238?auto=format&fit=crop&w=512&q=80",
    href: "/categories/solar-ips",
  },
  {
    title: "SOLAR PANEL",
    image:
      "https://images.unsplash.com/photo-1584270354949-1e0f0b5a9d9a?auto=format&fit=crop&w=512&q=80",
    href: "/categories/solar-panel",
  },
  {
    title: "SOLAR TOOLS",
    image:
      "https://images.unsplash.com/photo-1586201375761-83865001e17b?auto=format&fit=crop&w=512&q=80",
    href: "/categories/solar-tools",
  },
  {
    title: "STREET LIGHT",
    image:
      "https://images.unsplash.com/photo-1561365452-b9c1f6e032d4?auto=format&fit=crop&w=512&q=80",
    href: "/categories/street-light",
  },
];

export default function Categories() {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-8">
          Popular Categories
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((cat) => (
            <Link
              href={cat.href}
              key={cat.title}
              className="group text-center hover:shadow-lg transition rounded-lg p-2"
            >
              <div className="w-full aspect-square bg-gray-100 overflow-hidden rounded-lg">
                <Image
                  src={cat.image}
                  alt={cat.title}
                  width={300}
                  height={300}
                  className="object-cover w-full h-full transition-transform group-hover:scale-105"
                />
              </div>
              <h3 className="mt-4 text-sm md:text-base font-semibold text-gray-800">
                {cat.title}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
