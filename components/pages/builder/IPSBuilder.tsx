"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchProducts } from "@/store/productSlice";
import { addToCart } from "@/store/cartSlice";
import PaddingContainer from "@/components/common/PaddingContainer";
import { Settings, Zap, BatteryCharging, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { showCustomToast } from "@/lib/showCustomToast";

interface LoadItem {
  type: string;
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

const getClosestBattery = (ah: number, volt: number) => {
  const value = Math.ceil((ah * 1.5) / volt);
  if (value <= 100) return "100AH";
  if (value <= 130) return "130AH";
  if (value <= 165) return "165AH";
  if (value <= 200) return "200AH";
  if (value <= 250) return "130AH x 2";
  if (value <= 300) return "165AH x 2";
  if (value <= 400) return "200AH x 2";
  return `${value}AH (Custom)`;
};

const getIPSModel = (va: number) => {
  if (va < 600) return { model: "600VA", volt: 12 };
  if (va < 1000) return { model: "1000VA", volt: 12 };
  if (va < 1500) return { model: "1500VA", volt: 12 };
  if (va < 2500) return { model: "2500VA", volt: 24 };
  if (va < 3000) return { model: "3000VA", volt: 24 };
  if (va < 5000) return { model: "5000VA", volt: 48 };
  return { model: "8000VA", volt: 48 };
};

export default function IPSBuilder() {
  const dispatch = useDispatch<AppDispatch>();
  const products = useSelector(
    (state: RootState) => state.products.itemsByCategory
  );
  const ipsProducts = products["ips-solar-ips"] || [];
  const batteryProducts = products["battery"] || [];

  const [loads, setLoads] = useState<LoadItem[]>([
    { type: "Light", watt: 20, quantity: 2, hour: 4 },
    { type: "Fan", watt: 80, quantity: 2, hour: 4 },
    { type: "Router", watt: 30, quantity: 1, hour: 4 },
  ]);

  useEffect(() => {
    if (!products["ips-solar-ips"]) dispatch(fetchProducts("ips-solar-ips"));
    if (!products["battery"]) dispatch(fetchProducts("battery"));
  }, [dispatch, products]);

  const updateLoad = <K extends keyof LoadItem>(
    i: number,
    key: K,
    value: LoadItem[K]
  ) => {
    const updated = [...loads];
    updated[i][key] = value;
    if (key === "type") {
      const opt = loadOptions.find((l) => l.label === value);
      updated[i].watt = opt?.defaultWatt || 0;
    }
    setLoads(updated);
  };

  const totalWh = loads.reduce(
    (sum, l) => sum + l.watt * l.quantity * l.hour,
    0
  );
  const peakLoad = loads.reduce((sum, l) => sum + l.watt * l.quantity, 0);
  const recommendedWatt = peakLoad * 1.5;
  const recommendedVA = Math.ceil(recommendedWatt * 1.25);
  const ips = getIPSModel(recommendedVA);
  const batterySuggestion = getClosestBattery(totalWh, ips.volt);

  const filteredIPS = ipsProducts.filter((p) => {
    const match = p.name.match(/(\d+)/);
    const va = match ? parseInt(match[1]) : 0;
    return va >= recommendedVA;
  });

  const filteredBatteries = batteryProducts.filter((p) =>
    p.name.toLowerCase().includes(batterySuggestion.split("AH")[0])
  );

  const all = [...filteredIPS, ...filteredBatteries];

  return (
    <PaddingContainer className="py-10 space-y-10">
      <h1 className="text-2xl sm:text-3xl font-bold text-center">
        IPS System Builder
      </h1>

      {/* Load Inputs */}
      <div className="space-y-4">
        {/* Table Header (Desktop only) */}
        <div className="hidden sm:grid grid-cols-6 font-semibold bg-muted text-muted-foreground p-2 rounded-t text-sm">
          <span>Type</span>
          <span>Watt</span>
          <span>Qty</span>
          <span>Hours</span>
          <span>Total</span>
          <span></span> {/* Delete column */}
        </div>

        {loads.map((load, i) => (
          <div
            key={i}
            className="bg-background border rounded-lg p-4 sm:grid sm:grid-cols-6 sm:items-center sm:gap-3 text-sm space-y-3 sm:space-y-0 shadow-sm"
          >
            {/* Load Type */}
            <div>
              <div className="block sm:hidden text-xs text-muted-foreground mb-1 font-semibold">
                Load Type
              </div>
              <select
                value={load.type}
                onChange={(e) => updateLoad(i, "type", e.target.value)}
                className="w-full border rounded px-2 py-2 bg-background text-foreground"
              >
                {loadOptions.map((l) => (
                  <option key={l.label} value={l.label}>
                    {l.label}
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
                value={load.watt || ""}
                disabled={load.type !== "Custom"}
                onChange={(e) => {
                  const val = e.target.value;
                  if (/^\d*$/.test(val)) {
                    updateLoad(i, "watt", val === "" ? 0 : parseInt(val));
                  }
                }}
                className="w-full border rounded px-2 py-2 text-center bg-background text-foreground disabled:bg-gray-300 disabled:text-black"
              />
            </div>

            {/* Quantity */}
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

            {/* Hours */}
            <div>
              <div className="block sm:hidden text-xs text-muted-foreground mb-1 font-semibold">
                Hours
              </div>
              <div className="flex items-center justify-between sm:justify-center gap-2">
                <button
                  onClick={() =>
                    updateLoad(i, "hour", Math.max(1, (load.hour || 0) - 1))
                  }
                  className="w-8 h-8 flex items-center justify-center text-background hover:text-foreground rounded bg-primary hover:bg-secondary text-lg font-bold"
                >
                  −
                </button>
                <span className="min-w-[24px] text-center">{load.hour}</span>
                <button
                  onClick={() => updateLoad(i, "hour", (load.hour || 0) + 1)}
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
                {load.watt * load.quantity * load.hour} Wh
              </div>
            </div>

            {/* Delete */}
            <div className="flex justify-end sm:justify-center">
              <button
                onClick={() =>
                  setLoads((prev) => prev.filter((_, index) => index !== i))
                }
                className="w-8 h-8 rounded-full bg-red-100 hover:bg-red-200 text-red-600 flex items-center justify-center"
              >
                ×
              </button>
            </div>
          </div>
        ))}

        {/* Add Load Button */}
        <div className="text-center">
          <button
            onClick={() =>
              setLoads([
                ...loads,
                { type: "Custom", watt: 0, quantity: 1, hour: 1 },
              ])
            }
            className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-primary text-background hover:text-foreground rounded hover:bg-primary/90"
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

      {/* Recommendations */}
      <div className="p-6 bg-muted border rounded-lg shadow text-sm sm:text-base">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 flex items-center justify-center gap-2">
          <Settings className="w-5 h-5" /> IPS Recommendation
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <p>
            <Zap className="inline w-5 h-5 mr-2" /> Total Watt-Hour:{" "}
            <strong>{totalWh} Wh</strong>
          </p>
          <p>
            <Zap className="inline w-5 h-5 mr-2" /> Peak Load:{" "}
            <strong>{peakLoad} W</strong>
          </p>
          <p>
            <Zap className="inline w-5 h-5 mr-2" /> IPS:{" "}
            <strong>{ips.model}</strong> ({ips.volt}V)
          </p>
          <p>
            <BatteryCharging className="inline w-5 h-5 mr-2" /> Battery:{" "}
            <strong>{batterySuggestion}</strong>
          </p>
        </div>
      </div>

      {/* Product Display */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {all.map((product) => (
          <div key={product.id} className="border p-3 rounded shadow relative">
            <Image
              src={`${process.env.NEXT_PUBLIC_ASSETS_URL}${product.image}?height=200`}
              alt={product.name}
              width={200}
              height={200}
              className="w-full h-36 object-contain"
            />
            <p className="font-semibold mt-1 text-sm">{product.name}</p>
            <p className="text-primary font-bold text-sm">
              ৳ {parseFloat(product.discounted_price || product.price)}
            </p>
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
        ))}
      </div>
    </PaddingContainer>
  );
}
