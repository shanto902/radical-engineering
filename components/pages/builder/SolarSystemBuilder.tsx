/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import {
  BatteryCharging,
  PanelTop,
  Settings,
  Zap,
  Star,
  ShoppingBag,
} from "lucide-react";

import { AppDispatch, RootState } from "@/store";
import { fetchProducts } from "@/store/productSlice";
import { addToCart } from "@/store/cartSlice";
import PaddingContainer from "@/components/common/PaddingContainer";
import { showCustomToast } from "@/lib/showCustomToast";

type LoadType = "Light" | "Fan" | "TV" | "Computer" | "Printer" | "Custom";

interface LoadItem {
  type: LoadType;
  watt: number;
  quantity: number;
  hour: number;
}

const loadOptions = [
  { label: "💡 Light", defaultWatt: 20 },
  { label: "🌀 Fan", defaultWatt: 80 },
  { label: "📺 TV", defaultWatt: 100 },
  { label: "📡 Router", defaultWatt: 30 },
  { label: "💻 Computer", defaultWatt: 250 },
  { label: "🖨️ Printer", defaultWatt: 1000 },
  { label: "⚙️ Custom", defaultWatt: 0 },
];

const batteryOptions = [20, 30, 50, 60, 80, 100, 130, 150];
const panelOptions = [20, 30, 50, 65, 80, 100, 130, 150, 200, 225];
const controllerOptions = [10, 20, 30, 40, 50, 60];

const getClosestValue = (value: number, options: number[]) => {
  for (const option of options) {
    if (value <= option) return option;
  }
  return null;
};

const getBestTwoPanelCombo = (
  value: number,
  options: number[]
): number[] | null => {
  let bestCombo: number[] | null = null;
  let bestExcess = Infinity;
  for (let i = 0; i < options.length; i++) {
    for (let j = 0; j < options.length; j++) {
      const sum = options[i] + options[j];
      if (sum >= value && sum - value < bestExcess) {
        bestExcess = sum - value;
        bestCombo = [options[i], options[j]];
      }
    }
  }
  return bestCombo;
};

const categoryOptions = [
  { label: "Battery", slug: "battery" },
  { label: "Panel", slug: "solar-panels" },
];

export default function SolarSystemBuilder() {
  const dispatch = useDispatch<AppDispatch>();
  const [selectedCategory, setSelectedCategory] = useState<
    "battery" | "solar-panels"
  >("battery");

  const itemsByCategory = useSelector(
    (state: RootState) => state.products.itemsByCategory
  );
  const allProducts = itemsByCategory[selectedCategory] || [];

  const [loads, setLoads] = useState<LoadItem[]>([
    { type: "Light", watt: 5, quantity: 4, hour: 6 },
    { type: "Fan", watt: 15, quantity: 1, hour: 8 },
  ]);

  useEffect(() => {
    if (!itemsByCategory[selectedCategory]) {
      dispatch(fetchProducts(selectedCategory));
    }
  }, [dispatch, selectedCategory, itemsByCategory]);

  const updateLoad = <K extends keyof LoadItem>(
    index: number,
    key: K,
    value: LoadItem[K]
  ) => {
    const newLoads = [...loads];
    newLoads[index][key] = value;
    setLoads(newLoads);
  };

  const totalEnergy = loads.reduce(
    (sum, load) => sum + load.watt * load.quantity * load.hour,
    0
  );
  const batteryAH = totalEnergy / 12;
  const solarWatt = totalEnergy / 2.15;

  const recommendedBattery = getClosestValue(batteryAH, batteryOptions);
  const recommendedPanel =
    solarWatt > 225
      ? getBestTwoPanelCombo(solarWatt, panelOptions)
      : getClosestValue(solarWatt, panelOptions);
  const recommendedController = getClosestValue(
    totalEnergy / 26,
    controllerOptions
  );
  const panelThreshold = Array.isArray(recommendedPanel)
    ? recommendedPanel.reduce((a, b) => a + b, 0)
    : recommendedPanel;

  const filteredProducts = allProducts.filter((product) => {
    const match = product.name.match(/(\d+)\s*(AH|Wp|W)/i);
    const value = match ? parseInt(match[1]) : null;
    const unit = match?.[2]?.toLowerCase();

    if (selectedCategory === "battery" && recommendedBattery && unit === "ah") {
      return value && value >= recommendedBattery;
    }

    if (
      selectedCategory === "solar-panels" &&
      panelThreshold &&
      (unit === "wp" || unit === "w")
    ) {
      return value && value >= panelThreshold;
    }

    return true;
  });

  const totalPanelWatt = Array.isArray(recommendedPanel)
    ? recommendedPanel.reduce((a, b) => a + b, 0)
    : typeof recommendedPanel === "number"
    ? recommendedPanel
    : null;

  const panelText = Array.isArray(recommendedPanel)
    ? `${recommendedPanel.join(" + ")} = ${totalPanelWatt} Wp`
    : recommendedPanel
    ? `${recommendedPanel} Wp`
    : "Contact team";

  return (
    <PaddingContainer className="py-10 space-y-10">
      <h1 className="text-2xl sm:text-3xl font-bold text-center">
        Solar System Builder
      </h1>

      <div className="space-y-3">
        {/* Header - Only visible on desktop */}
        <div className="hidden sm:grid grid-cols-6 font-semibold bg-muted text-muted-foreground p-2 rounded-t text-sm">
          <span>Type</span>
          <span>Watt</span>
          <span>Qty</span>
          <span>Hours</span>
          <span>Total</span>
        </div>

        {/* Load Rows */}
        {loads.map((load, i) => (
          <div
            key={i}
            className="bg-background border rounded-lg p-4 sm:grid sm:grid-cols-6 sm:items-center sm:gap-3 text-sm space-y-3 sm:space-y-0 shadow-sm"
          >
            {/* Type */}
            <div>
              <div className="block sm:hidden text-xs text-muted-foreground mb-1 font-semibold">
                Type
              </div>
              <select
                className="w-full border rounded px-2 py-2 bg-background"
                value={load.type}
                onChange={(e) => {
                  const opt = loadOptions.find(
                    (l) => l.label === e.target.value
                  );
                  if (opt) {
                    updateLoad(i, "type", opt.label as LoadType);
                    updateLoad(i, "watt", opt.defaultWatt);
                  }
                }}
              >
                {loadOptions.map((opt) => (
                  <option key={opt.label} value={opt.label}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Watt */}
            <div>
              <div className="block sm:hidden text-xs text-muted-foreground mb-1 font-semibold">
                Watt
              </div>
              <input
                type="number"
                value={load.watt}
                className="w-full border rounded px-2 py-2 text-center bg-background"
                onChange={(e) => {
                  const val = e.target.value;
                  if (/^\d*$/.test(val)) {
                    updateLoad(i, "watt", val === "" ? 0 : parseFloat(val));
                  }
                }}
              />
            </div>

            {/* Quantity with +/- Buttons */}
            <div>
              <div className="block sm:hidden text-xs text-muted-foreground mb-1 font-semibold">
                Qty
              </div>
              <div className="flex items-center justify-between sm:justify-center gap-2">
                <button
                  onClick={() =>
                    updateLoad(i, "quantity", Math.max(1, load.quantity - 1))
                  }
                  className="w-8 h-8 flex items-center justify-center text-background hover:text-foreground rounded bg-primary hover:bg-secondary text-lg font-bold"
                >
                  −
                </button>
                <span className="min-w-[24px] text-center">
                  {load.quantity}
                </span>
                <button
                  onClick={() => updateLoad(i, "quantity", load.quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center text-background hover:text-foreground rounded bg-primary hover:bg-secondary text-lg font-bold"
                >
                  +
                </button>
              </div>
            </div>

            {/* Hours with +/- Buttons */}
            <div>
              <div className="block sm:hidden text-xs text-muted-foreground mb-1 font-semibold">
                Hours
              </div>
              <div className="flex items-center justify-between sm:justify-center gap-2">
                <button
                  onClick={() =>
                    updateLoad(i, "hour", Math.max(1, load.hour - 1))
                  }
                  className="w-8 h-8 flex items-center justify-center text-background hover:text-foreground rounded bg-primary hover:bg-secondary text-lg font-bold"
                >
                  −
                </button>
                <span className="min-w-[32px] text-center">{load.hour}</span>
                <button
                  onClick={() => updateLoad(i, "hour", load.hour + 1)}
                  className="w-8 h-8 flex items-center justify-center text-background hover:text-foreground rounded bg-primary hover:bg-secondary text-lg font-bold"
                >
                  +
                </button>
              </div>
            </div>

            {/* Total */}
            <div>
              <div className="block sm:hidden text-xs text-muted-foreground mb-1 font-semibold">
                Total
              </div>
              <div className="text-center">
                {load.watt * load.quantity * load.hour} Wp
              </div>
            </div>

            {/* Delete Button */}
            <div className="flex justify-end sm:justify-center">
              <button
                onClick={() => setLoads(loads.filter((_, idx) => idx !== i))}
                className="w-8 h-8 rounded-full bg-red-100 hover:bg-red-200 text-red-600 flex items-center justify-center"
              >
                ×
              </button>
            </div>
          </div>
        ))}

        {/* Add Load */}
        <div className="text-center">
          <button
            onClick={() =>
              setLoads([
                ...loads,
                { type: "Custom", watt: 0, quantity: 1, hour: 1 },
              ])
            }
            className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-primary  text-background hover:text-foreground rounded hover:bg-primary/90"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Load
          </button>
        </div>
      </div>

      {/* Recommendation */}
      <div className="p-6 bg-muted border rounded-lg shadow text-sm sm:text-base">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 flex justify-center items-center gap-2">
          <Settings className="w-5 h-5" /> Recommended System
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <p>
            <Zap className="inline w-5 h-5 mr-2" /> Total Energy:{" "}
            {totalEnergy.toFixed(2)} Wh
          </p>
          <p>
            <PanelTop className="inline w-5 h-5 mr-2" /> Panel: {panelText}
          </p>
          <p>
            <BatteryCharging className="inline w-5 h-5 mr-2" /> Battery:{" "}
            {recommendedBattery ?? "Contact team"} AH
          </p>
          <p>
            <Zap className="inline w-5 h-5 mr-2" /> Controller:{" "}
            {recommendedController ?? "Contact team"} Amp
          </p>
        </div>
      </div>

      {/* Category Selector */}
      <div className="flex flex-wrap gap-3 justify-center">
        {categoryOptions.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => setSelectedCategory(cat.slug as any)}
            className={`px-4 py-2 border rounded-full font-medium ${
              selectedCategory === cat.slug
                ? "bg-primary text-background"
                : "bg-muted"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredProducts.map((product) => {
          const price = parseFloat(product.discounted_price || product.price);
          const match = product.name.match(/(\d+)\s*(AH|Wp|W)/i);
          const value = match ? parseInt(match[1]) : null;
          const unit = match?.[2]?.toLowerCase() || "";
          const totalPanelWatt = Array.isArray(recommendedPanel)
            ? recommendedPanel.reduce((a, b) => a + b, 0)
            : typeof recommendedPanel === "number"
            ? recommendedPanel
            : null;

          const isRecommended =
            (selectedCategory === "battery" &&
              recommendedBattery &&
              unit === "ah" &&
              value &&
              value >= recommendedBattery) ||
            (selectedCategory === "solar-panels" &&
              totalPanelWatt &&
              (unit === "wp" || unit === "w") &&
              value &&
              value >= totalPanelWatt);

          return (
            <div
              key={product.id}
              className="relative p-3 border rounded bg-background shadow hover:shadow-md transition"
            >
              {isRecommended && (
                <span className="absolute top-2 right-2 bg-primary text-background text-[10px] px-2 py-1 rounded flex items-center gap-1">
                  <Star className="w-3 h-3" /> Recommended
                </span>
              )}
              <Image
                src={`${process.env.NEXT_PUBLIC_ASSETS_URL}${product.image}?height=200`}
                alt={product.name}
                width={200}
                height={200}
                placeholder="blur"
                blurDataURL={`${process.env.NEXT_PUBLIC_ASSETS_URL}${product.image}?width=10&quality=1`}
                className="w-full h-36 object-contain bg-background"
              />
              <p className="mt-2 font-semibold text-sm">{product.name}</p>
              <p className="text-primary font-bold text-sm">৳ {price}</p>
              <button
                onClick={() =>
                  dispatch(
                    addToCart({
                      ...product,
                      quantity: 1,
                      price: parseFloat(product.price),
                      ...(product.discounted_price && {
                        discounted_price: parseFloat(product.discounted_price),
                      }),
                    }),
                    showCustomToast({
                      icon: ShoppingBag,
                      message: "Product added to cart!",
                      id: `cart-add-${product.id}`,
                    })
                  )
                }
                className="mt-2 w-full text-xs px-2 py-1 bg-primary text-white rounded"
              >
                Add to Cart
              </button>
            </div>
          );
        })}
      </div>
    </PaddingContainer>
  );
}
