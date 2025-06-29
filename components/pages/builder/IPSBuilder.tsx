"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchProducts } from "@/store/productSlice";
import { addToCart } from "@/store/cartSlice";
import PaddingContainer from "@/components/common/PaddingContainer";
import { Settings, Zap, BatteryCharging } from "lucide-react";
import Image from "next/image";

interface LoadItem {
  type: string;
  watt: number;
  quantity: number;
  hour: number;
}

const loadOptions = [
  { label: "Light", defaultWatt: 20 },
  { label: "Fan", defaultWatt: 80 },
  { label: "TV", defaultWatt: 100 },
  { label: "Router", defaultWatt: 30 },
  { label: "Computer", defaultWatt: 250 },
  { label: "Printer", defaultWatt: 1000 },
  { label: "Custom", defaultWatt: 0 },
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
  if (va <= 600) return { model: "600VA", volt: 12 };
  if (va <= 1000) return { model: "1000VA", volt: 12 };
  if (va <= 1500) return { model: "1500VA", volt: 12 };
  if (va <= 2500) return { model: "2500VA", volt: 24 };
  if (va <= 3000) return { model: "3000VA", volt: 24 };
  if (va <= 5000) return { model: "5000VA", volt: 48 };
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
        {loads.map((load, i) => (
          <div
            key={i}
            className="grid grid-cols-2 sm:grid-cols-6 gap-2 items-center"
          >
            <label>
              Load Type
              <select
                value={load.type}
                onChange={(e) => updateLoad(i, "type", e.target.value)}
                className="border rounded px-2 py-1 w-full bg-background text-foreground"
              >
                {loadOptions.map((l) => (
                  <option key={l.label} value={l.label}>
                    {l.label}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Watt
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
                className="border px-2 py-1 bg-background text-foreground disabled:bg-gray-600 rounded w-full"
              />
            </label>

            <label>
              Qty
              <input
                type="number"
                value={load.quantity || ""}
                onChange={(e) => {
                  const val = e.target.value;
                  if (/^\d*$/.test(val)) {
                    updateLoad(i, "quantity", val === "" ? 0 : parseInt(val));
                  }
                }}
                className="border px-2 py-1 bg-background text-foreground rounded w-full"
              />
            </label>

            <label>
              Hours
              <input
                type="number"
                value={load.hour || ""}
                onChange={(e) => {
                  const val = e.target.value;
                  if (/^\d*$/.test(val)) {
                    updateLoad(i, "hour", val === "" ? 0 : parseInt(val));
                  }
                }}
                className="border px-2 py-1 bg-background text-foreground rounded w-full"
              />
            </label>

            <div>Total: {load.watt * load.quantity * load.hour} Wh</div>
            <button
              onClick={() =>
                setLoads((prev) => prev.filter((_, index) => index !== i))
              }
              className="text-red-500 text-sm hover:underline"
            >
              Remove
            </button>
          </div>
        ))}

        <button
          onClick={() =>
            setLoads([
              ...loads,
              { type: "Custom", watt: 0, quantity: 1, hour: 1 },
            ])
          }
          className="text-sm mt-2 px-4 py-2 border rounded bg-primary text-white"
        >
          + Add Load
        </button>
      </div>

      {/* Recommendations */}
      <div className="bg-muted p-4 rounded shadow text-sm space-y-2">
        <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
          <Settings className="w-4 h-4" /> Recommendation
        </h2>
        <p>
          <Zap className="inline w-4 h-4 mr-1" /> Total Watt-Hour:{" "}
          <strong>{totalWh} Wh</strong>
        </p>
        <p>
          <Zap className="inline w-4 h-4 mr-1" /> Peak Load:{" "}
          <strong>{peakLoad} W</strong>
        </p>
        <p>
          <Zap className="inline w-4 h-4 mr-1" /> IPS:{" "}
          <strong>{ips.model}</strong> ({ips.volt}V)
        </p>
        <p>
          <BatteryCharging className="inline w-4 h-4 mr-1" /> Battery:{" "}
          <strong>{batterySuggestion}</strong>
        </p>
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
