"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { addToCart } from "@/store/cartSlice";

import Image from "next/image";
import {
  BatteryCharging,
  Minus,
  PanelTop,
  Plus,
  PlusCircle,
  ShoppingCart,
  Trash,
  Zap,
} from "lucide-react";

type LoadType = "Light" | "Fan" | "TV" | "Computer" | "Printer" | "Custom";

interface LoadItem {
  type: LoadType;
  watt: number;
  quantity: number;
  hour: number;
}

const loadOptions: {
  label: LoadType;
  defaultWatt: number;
}[] = [
  {
    label: "Light",
    defaultWatt: 5,
  },
  { label: "Fan", defaultWatt: 15 },
  { label: "TV", defaultWatt: 80 },
  {
    label: "Computer",
    defaultWatt: 150,
  },
  {
    label: "Printer",
    defaultWatt: 200,
  },
  { label: "Custom", defaultWatt: 0 },
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

export default function SolarSystemBuilder() {
  const dispatch = useDispatch();
  const products = useSelector((state: RootState) => state.products.items);

  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const handleQtyChange = (productId: string, amount: number) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(1, (prev[productId] || 1) + amount),
    }));
  };

  const [loads, setLoads] = useState<LoadItem[]>([
    { type: "Light", watt: 5, quantity: 4, hour: 6 },
    { type: "Fan", watt: 15, quantity: 1, hour: 8 },
  ]);

  const updateLoad = <K extends keyof LoadItem>(
    index: number,
    key: K,
    value: LoadItem[K]
  ) => {
    const newLoads = [...loads];
    newLoads[index][key] = value;
    setLoads(newLoads);
  };

  const addLoad = () =>
    setLoads([...loads, { type: "Custom", watt: 0, quantity: 1, hour: 1 }]);

  const removeLoad = (index: number) =>
    setLoads(loads.filter((_, i) => i !== index));

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

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 ">
      <h1 className="text-3xl font-bold text-center mb-6">
        Solar System Builder
      </h1>

      {/* Table Header */}
      <div className="grid grid-cols-6 font-semibold bg-background p-2 rounded-t-md text-sm mb-2">
        <span>Type</span>
        <span>Watt</span>
        <span>Quantity</span>
        <span>Hours</span>
        <span>Total</span>
        <span className="text-right">Action</span>
      </div>

      {/* Load Rows */}
      {loads.map((load, i) => (
        <div
          key={i}
          className="grid grid-cols-6 items-center bg-background border-b p-2 text-sm"
        >
          <select
            className="border rounded bg-background px-2 py-1"
            value={load.type}
            onChange={(e) => {
              const selected = loadOptions.find(
                (l) => l.label === e.target.value
              );
              if (selected) {
                updateLoad(i, "type", selected.label);
                updateLoad(i, "watt", selected.defaultWatt);
              }
            }}
          >
            {loadOptions.map((opt) => (
              <option key={opt.label} value={opt.label}>
                {opt.label}
              </option>
            ))}
          </select>

          <input
            type="number"
            value={load.watt}
            className="border p-1 rounded ml-2 bg-background text-center"
            onChange={(e) => updateLoad(i, "watt", parseFloat(e.target.value))}
            disabled={load.type !== "Custom"}
          />

          <div className="flex items-center justify-center gap-1">
            <button
              aria-label="Quantity Decrement"
              onClick={() =>
                updateLoad(i, "quantity", Math.max(1, load.quantity - 1))
              }
            >
              <Minus className="w-4 h-4" />
            </button>
            <span>{load.quantity}</span>
            <button
              aria-label="Quantity Increment"
              onClick={() => updateLoad(i, "quantity", load.quantity + 1)}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <input
            type="number"
            value={load.hour}
            className="border p-1 rounded text-center bg-background"
            onChange={(e) => updateLoad(i, "hour", parseFloat(e.target.value))}
          />

          <span className="text-center">
            {load.watt * load.quantity * load.hour} Wh
          </span>

          <button
            aria-label="Remove from cart"
            onClick={() => removeLoad(i)}
            className="text-red-600 bg-white rounded-full p-2 hover:bg-primary hover:text-background justify-self-end"
          >
            <Trash className="w-4 h-4" />
          </button>
        </div>
      ))}

      {/* Add Load Button */}
      <div className="text-center mt-4">
        <button
          aria-label="Add Load"
          onClick={addLoad}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-background rounded hover:bg-secondary hover:text-foreground"
        >
          <PlusCircle className="w-4 h-4" /> Add Load
        </button>
      </div>

      {/* Summary Section */}
      <div className="bg-background mt-8 p-6 border rounded-md shadow text-sm sm:text-base">
        <h2 className="text-xl font-semibold mb-4 text-center">
          🔧 Recommended System
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <p>
            <BatteryCharging className="inline w-5 h-5 mr-2" />
            Battery AH: {batteryAH.toFixed(2)} AH
          </p>
          <p>
            <Zap className="inline w-5 h-5 mr-2" />
            Total Energy: {totalEnergy.toFixed(2)} Wh
          </p>
          <p>
            <PanelTop className="inline w-5 h-5 mr-2" />
            Panel:{" "}
            {Array.isArray(recommendedPanel)
              ? `${recommendedPanel.join(" + ")} = ${recommendedPanel.reduce(
                  (a, b) => a + b,
                  0
                )} W`
              : `${recommendedPanel ?? "Contact team"} W`}
          </p>
          <p>
            <BatteryCharging className="inline w-5 h-5 mr-2" />
            Battery: {recommendedBattery ?? "Contact team"} AH
          </p>
          <p>
            <Zap className="inline w-5 h-5 mr-2" />
            Controller: {recommendedController ?? "Contact team"} Amp
          </p>
        </div>
      </div>

      {/* Suggested Products */}
      {products?.length > 0 && (
        <div className="mt-10">
          <h3 className="text-xl font-semibold mb-4">⚡ Suggested Products</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.slice(0, 4).map((product) => {
              const qty = quantities[product.id] || 1;
              const price = parseFloat(product.price);
              const discounted = product.discounted_price
                ? parseFloat(product.discounted_price)
                : null;

              return (
                <div
                  key={product.id}
                  className="p-4 border rounded shadow hover:shadow-lg transition flex flex-col"
                >
                  <Image
                    src={`${process.env.NEXT_PUBLIC_ASSETS_URL}${product.image}`}
                    alt={product.name}
                    width={200}
                    height={200}
                    className="object-cover w-full h-40 rounded"
                  />
                  <h4 className="text-sm font-semibold mt-2">{product.name}</h4>

                  {discounted ? (
                    <p className="gap-2">
                      <span className="text-xs text-gray-500 line-through">
                        ৳ {price}
                      </span>{" "}
                      <span className="text-sm font-bold text-primary">
                        ৳ {discounted}
                      </span>
                    </p>
                  ) : (
                    <p className="text-sm font-bold text-primary">৳ {price}</p>
                  )}

                  {/* Quantity Selector */}
                  <div className="flex items-center justify-between mt-2 border px-2 py-1 rounded">
                    <button
                      aria-label="Quantity Decrement"
                      onClick={() => handleQtyChange(product.id, -1)}
                      className="p-1"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span>{qty}</span>
                    <button
                      aria-label="Quantity Increment"
                      onClick={() => handleQtyChange(product.id, 1)}
                      className="p-1"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Add to Cart */}
                  <button
                    aria-label="Add To Cart"
                    onClick={() =>
                      dispatch(
                        addToCart({
                          ...product,
                          quantity: qty,
                          price,
                          ...(discounted !== null && {
                            discounted_price: discounted,
                          }),
                        })
                      )
                    }
                    className="mt-2 w-full bg-primary text-background hover:text-foreground py-1 rounded text-sm hover:bg-secondary flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Print Button */}
      {/* <div className="text-right mt-6">
        <PDFExportWrapper>
          <>
            <h1 className="text-3xl font-bold text-center mb-6">
              ☀️ Solar System Builder Summary
            </h1>

          
            <div className="grid grid-cols-6 font-semibold textpb bg-gray-100 p-2 rounded-t-md text-sm mb-2">
              <span>Type</span>
              <span>Watt</span>
              <span>Quantity</span>
              <span>Hours</span>
              <span>Total</span>
              <span className="text-right">Note</span>
            </div>

            
            {[
              { type: "Light", watt: 5, quantity: 4, hour: 6 },
              { type: "Fan", watt: 15, quantity: 1, hour: 8 },
            ].map((load, i) => (
              <div
                key={i}
                className="grid grid-cols-6 items-center text-black bg-white border-b p-2 text-sm"
              >
                <span>{load.type}</span>
                <span>{load.watt} W</span>
                <span>{load.quantity}</span>
                <span>{load.hour}</span>
                <span>{load.watt * load.quantity * load.hour} Wh</span>
                <span className="text-right">-</span>
              </div>
            ))}

     
            <div className="bg-gray-50 mt-8 p-6 rounded-md shadow text-sm sm:text-base">
              <h2 className="text-xl font-semibold text-center mb-6 flex items-center justify-center gap-2">
                <span>🔧</span> Recommended System
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-x-12 px-4">
                <div className="space-y-2">
                  <p className="flex items-center gap-2">
                    ⚡ <span>Battery AH:</span>{" "}
                    <strong className="ml-1">50 AH</strong>
                  </p>
                  <p className="flex items-center gap-2">
                    🖥️ <span>Panel:</span>{" "}
                    <strong className="ml-1">130 + 100 = 230 W</strong>
                  </p>
                  <p className="flex items-center gap-2">
                    ⚡ <span>Controller:</span>{" "}
                    <strong className="ml-1">20 Amp</strong>
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="flex items-center gap-2">
                    ⚡ <span>Total Energy:</span>{" "}
                    <strong className="ml-1">240 Wh</strong>
                  </p>
                  <p className="flex items-center gap-2">
                    ⚡ <span>Battery:</span>{" "}
                    <strong className="ml-1">60 AH</strong>
                  </p>
                </div>
              </div>
            </div>
          </>
        </PDFExportWrapper>
      </div> */}
    </div>
  );
}
