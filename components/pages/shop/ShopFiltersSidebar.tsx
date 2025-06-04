"use client";

import { useState } from "react";
import { Range, getTrackBackground } from "react-range";
import { TCategory } from "@/interfaces";
import { FilterIcon, X } from "lucide-react";
import { useEffect } from "react";
import { isNativeApp } from "@/components/common/isNativeApp";

interface Props {
  subcategories: string[];
  selectedSubcategories: string[];
  onSubChange: (sub: string) => void;
  brands: string[];
  selectedBrands: string[];
  onBrandChange: (brand: string) => void;
  priceRange: [number, number];
  setPriceRange: (val: [number, number]) => void;
  maxPrice: number;
  categories: TCategory[];
}

const STEP = 100;
const MIN = 0;

export default function FilterSidebar({
  subcategories,
  selectedSubcategories,
  onSubChange,
  brands,
  selectedBrands,
  onBrandChange,
  priceRange,
  setPriceRange,
  maxPrice,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isNative, setIsNative] = useState(false);

  useEffect(() => {
    setIsNative(isNativeApp());
  }, []);

  return (
    <>
      {/* 🟡 Mobile Filter Button */}

      {isNative && (
        <div className="fixed z-40 top-14 left-0 right-0 bg-primary text-background py-3 px-4 md:hidden shadow-md">
          <button
            onClick={() => setIsOpen(true)}
            className="w-full text-center font-bold text-lg flex gap-2 items-center justify-center"
          >
            <FilterIcon /> Filter Products
          </button>
        </div>
      )}

      <div className="fixed md:hidden z-40 top-16 left-0 right-0 bg-primary text-background py-2 px-4  shadow-md">
        <button
          onClick={() => setIsOpen(true)}
          className="w-full text-center font-bold text-lg flex gap-2 items-center justify-center"
        >
          <FilterIcon /> Filter Products
        </button>
      </div>

      {/* 🖥️ Desktop Sidebar */}
      <aside className="hidden md:block px-4 space-y-6">
        <div className={""}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Filters</h3>
            <button onClick={() => setIsOpen(false)}>
              <X className="w-6 h-6 text-foreground" />
            </button>
          </div>

          <FilterContent
            subcategories={subcategories}
            selectedSubcategories={selectedSubcategories}
            onSubChange={onSubChange}
            brands={brands}
            selectedBrands={selectedBrands}
            onBrandChange={onBrandChange}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            maxPrice={maxPrice}
          />
        </div>
      </aside>

      {/* 📱 Mobile Drawer Sidebar */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed right-0 top-0 bottom-0 w-3/4 max-w-sm z-50 bg-background p-4 overflow-y-auto shadow-lg animate-slide-in-right">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Filters</h3>
              <button onClick={() => setIsOpen(false)}>
                <X className="w-6 h-6 text-foreground" />
              </button>
            </div>

            <FilterContent
              subcategories={subcategories}
              selectedSubcategories={selectedSubcategories}
              onSubChange={onSubChange}
              brands={brands}
              selectedBrands={selectedBrands}
              onBrandChange={onBrandChange}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              maxPrice={maxPrice}
            />
          </div>
        </>
      )}
    </>
  );
}

// 🔁 Reusable Filter Content Block
function FilterContent({
  subcategories,
  selectedSubcategories,
  onSubChange,
  brands,
  selectedBrands,
  onBrandChange,
  priceRange,
  setPriceRange,
  maxPrice,
}: Omit<Props, "categories">) {
  return (
    <div className="space-y-6">
      {subcategories.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Subcategories</h3>
          {subcategories.map((sub) => (
            <label
              key={sub}
              className="flex items-center   gap-2  md:space-y-0 md:space-x-2 text-sm"
            >
              <input
                type="checkbox"
                checked={selectedSubcategories.includes(sub)}
                onChange={() => onSubChange(sub)}
                className="accent-primary"
              />
              <span>{sub}</span>
            </label>
          ))}
        </div>
      )}

      <div>
        <h3 className="text-xl font-semibold mb-4">Price Range (৳)</h3>
        <div className="text-sm mb-2">
          {priceRange[0].toLocaleString()}৳ – {priceRange[1].toLocaleString()}৳
        </div>
        <Range
          values={priceRange}
          step={STEP}
          min={MIN}
          max={maxPrice}
          onChange={(vals) => setPriceRange(vals as [number, number])}
          renderTrack={({ props, children }) => (
            <div
              ref={props.ref}
              onMouseDown={props.onMouseDown}
              onTouchStart={props.onTouchStart}
              style={{
                ...props.style,
                background: getTrackBackground({
                  values: priceRange,
                  colors: ["#ccc", "#452819", "#ccc"],
                  min: MIN,
                  max: maxPrice,
                }),
              }}
              className="h-1 rounded bg-foreground"
            >
              {children}
            </div>
          )}
          renderThumb={({ props }) => (
            <div
              {...props}
              className="w-3 h-3 bg-primary rounded-full shadow"
            />
          )}
        />
      </div>

      {brands.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Brands</h3>
          {brands.map((brand) => (
            <label key={brand} className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                checked={selectedBrands.includes(brand)}
                onChange={() => onBrandChange(brand)}
                className="accent-primary"
              />
              <span>{brand}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
