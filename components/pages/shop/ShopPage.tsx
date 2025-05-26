"use client";

import { useState } from "react";
import Image from "next/image";
import { Range, getTrackBackground } from "react-range";

const categories = [
  "Solar Panel",
  "Battery",
  "Inverter",
  "Street Light",
  "Accessories",
];

const products = [
  {
    id: 1,
    title: "Solar Panel 225W 12v",
    image: "https://images.unsplash.com/photo-1584270354949-1e0f0b5a9d9a",
    price: 7875,
    category: "Solar Panel",
  },
  {
    id: 2,
    title: "Mono Solar Panel 150W",
    image: "https://images.unsplash.com/photo-1596495577886-d920f1fb7238",
    price: 6412,
    category: "Solar Panel",
  },
  {
    id: 3,
    title: "Battery 12v 7.5A",
    image: "https://images.unsplash.com/photo-1581091012184-7e0cdfbb679b",
    price: 1350,
    category: "Battery",
  },
  {
    id: 4,
    title: "Street Light Solar LED",
    image: "https://images.unsplash.com/photo-1561365452-b9c1f6e032d4",
    price: 9500,
    category: "Street Light",
  },
];

const STEP = 100;
const MIN = 0;
const MAX = 25000;

export default function ShopPage() {
  const [values, setValues] = useState([0, 25000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const handleCategoryChange = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const filteredProducts = products.filter((p) => {
    const [minPrice, maxPrice] = values;
    const priceMatch = p.price >= minPrice && p.price <= maxPrice;
    const categoryMatch =
      selectedCategories.length === 0 ||
      selectedCategories.includes(p.category);
    return priceMatch && categoryMatch;
  });

  return (
    <section className="max-w-7xl mx-auto px-4 py-20 grid grid-cols-1 md:grid-cols-[250px_1fr] gap-10">
      {/* Sidebar */}
      <aside>
        <h2 className="text-xl font-semibold mb-4">Filter by</h2>

        {/* Price Slider */}
        <div className="mb-8">
          <h3 className="text-md font-medium mb-4">Price Range (৳)</h3>
          <div className="mb-2 text-sm text-gray-600">
            {values[0].toLocaleString()}৳ – {values[1].toLocaleString()}৳
          </div>

          <Range
            key={values[0]}
            values={values}
            step={STEP}
            min={MIN}
            max={MAX}
            onChange={(vals) => setValues(vals)}
            renderTrack={({ props, children }) => (
              <div
                key={1}
                ref={props.ref}
                onMouseDown={props.onMouseDown}
                onTouchStart={props.onTouchStart}
                style={{
                  ...props.style,
                  background: getTrackBackground({
                    values,
                    colors: ["#ccc", "#452819", "#ccc"],
                    min: MIN,
                    max: MAX,
                  }),
                }}
                className="h-2 rounded bg-gray-200"
              >
                {children}
              </div>
            )}
            renderThumb={({ props, index }) => {
              const { key, ...thumbProps } = props; // extract key to avoid spreading
              return (
                <div
                  key={key ?? index} // pass key directly
                  {...thumbProps}
                  className="w-5 h-5 bg-primary rounded-full shadow outline-none"
                />
              );
            }}
          />
        </div>

        {/* Category Filter */}
        <div>
          <h3 className="text-md font-medium mb-2">Category</h3>
          {categories.map((cat) => (
            <label key={cat} className="flex items-center mb-2 text-sm">
              <input
                type="checkbox"
                className="mr-2"
                checked={selectedCategories.includes(cat)}
                onChange={() => handleCategoryChange(cat)}
              />
              {cat}
            </label>
          ))}
        </div>
      </aside>

      {/* Product Grid */}
      <main>
        <h1 className="text-2xl font-bold mb-6">Shop Products</h1>
        {filteredProducts.length === 0 ? (
          <p>No products match your filters.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="border rounded-lg shadow hover:shadow-md p-4"
              >
                <Image
                  src={`${product.image}?auto=format&fit=crop&w=500&q=80`}
                  alt={product.title}
                  width={300}
                  height={200}
                  className="rounded w-full h-48 object-cover mb-4"
                />
                <h3 className="text-lg font-semibold">{product.title}</h3>
                <p className="text-primary text-xl font-bold">
                  {product.price.toLocaleString()}৳
                </p>
                <p className="text-sm text-gray-500 mt-1">{product.category}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </section>
  );
}
