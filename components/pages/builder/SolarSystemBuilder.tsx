"use client";

import { useEffect, useState } from "react";

import { AppDispatch, RootState } from "@/store";
import { addToCart } from "@/store/cartSlice";
import Image from "next/image";
import {
  BatteryCharging,
  Minus,
  PanelTop,
  Plus,
  PlusCircle,
  Settings,
  ShoppingCart,
  Trash,
  Zap,
} from "lucide-react";

import PaddingContainer from "@/components/common/PaddingContainer";
import { showCustomToast } from "@/lib/showCustomToast";
import { fetchProducts } from "@/store/productSlice";
import { useDispatch, useSelector } from "react-redux";

type LoadType = "Light" | "Fan" | "TV" | "Computer" | "Printer" | "Custom";

interface LoadItem {
  type: LoadType;
  watt: number;
  quantity: number;
  hour: number;
}

const loadOptions = [
  { label: "Light", defaultWatt: 5 },
  { label: "Fan", defaultWatt: 15 },
  { label: "TV", defaultWatt: 80 },
  { label: "Computer", defaultWatt: 150 },
  { label: "Printer", defaultWatt: 200 },
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
  const dispatch = useDispatch<AppDispatch>();
  const [selectedCategory, setSelectedCategory] = useState<"Battery" | "Panel">(
    "Battery"
  );

  const itemsByCategory = useSelector(
    (state: RootState) => state.products.itemsByCategory
  );

  const allProducts = Object.values(itemsByCategory).flat();

  const products = allProducts.filter((p) =>
    p.category?.name?.toLowerCase().includes(selectedCategory.toLowerCase())
  );

  useEffect(() => {
    const categoriesToFetch = [
      "battery",
      "solar-panels",
      "Inverter",
      "Controller",
    ];
    categoriesToFetch.forEach((cat) => {
      if (!itemsByCategory[cat]) {
        dispatch(fetchProducts(cat));
      }
    });
  }, [dispatch, itemsByCategory]);
  const [loads, setLoads] = useState<LoadItem[]>([
    { type: "Light", watt: 5, quantity: 4, hour: 6 },
    { type: "Fan", watt: 15, quantity: 1, hour: 8 },
  ]);

  const [selectedProducts, setSelectedProducts] = useState<
    { id: string; quantity: number }[]
  >([]);

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

  const toggleProductSelection = (id: string) => {
    setSelectedProducts((prev) =>
      prev.some((p) => p.id === id)
        ? prev.filter((p) => p.id !== id)
        : [...prev, { id, quantity: 1 }]
    );
  };

  const updateSelectedProductQty = (id: string, delta: number) => {
    setSelectedProducts((prev) =>
      prev?.map((p) =>
        p.id === id ? { ...p, quantity: Math.max(1, p.quantity + delta) } : p
      )
    );
  };

  const totalCost = selectedProducts.reduce((sum, sel) => {
    const product = products.find((p) => p.id === sel.id);
    if (!product) return sum;
    const price = parseFloat(product.discounted_price || product.price);
    return sum + price * sel.quantity;
  }, 0);

  return (
    <PaddingContainer className=" py-10">
      <h1 className="text-3xl font-bold text-center mb-6">
        Solar System Builder
      </h1>

      {/* Loads Table */}
      <div className="grid grid-cols-6 font-semibold bg-background p-2 rounded-t-md text-sm mb-2">
        <span>Type</span>
        <span>Watt</span>
        <span>Quantity</span>
        <span>Hours</span>
        <span>Total</span>
        <span className="text-right">Action</span>
      </div>

      {loads?.map((load, i) => (
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
                updateLoad(i, "type", selected.label as LoadType);
                updateLoad(i, "watt", selected.defaultWatt);
              }
            }}
          >
            {loadOptions?.map((opt) => (
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
              onClick={() =>
                updateLoad(i, "quantity", Math.max(1, load.quantity - 1))
              }
            >
              <Minus className="w-4 h-4" />
            </button>
            <span>{load.quantity}</span>
            <button
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
            {load.watt * load.quantity * load.hour} Wp
          </span>

          <button
            onClick={() => removeLoad(i)}
            className="text-red-600 p-2 rounded-full hover:bg-primary hover:text-background justify-self-end"
          >
            <Trash className="w-4 h-4" />
          </button>
        </div>
      ))}

      <div className="text-center mt-4">
        <button
          onClick={addLoad}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-background rounded hover:bg-secondary hover:text-foreground"
        >
          <PlusCircle className="w-4 h-4" /> Add Load
        </button>
      </div>

      {/* Recommended Settings */}
      <div className="bg-background mt-8 p-6 border rounded-md shadow text-sm sm:text-base">
        <h2 className="text-xl font-semibold mb-4 text-center flex items-center justify-center gap-2">
          <Settings /> Recommended System
        </h2>
        <div className="flex justify-between mt-5">
          <p>
            <Zap className="inline w-5 h-5 mr-2" />
            Total Energy: {totalEnergy.toFixed(2)} Wp
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

      {/* Category Selector */}
      <div className="mt-10 flex gap-4 items-center">
        <h3 className="font-bold">Select Category:</h3>
        <button
          className={`px-3 py-1 border rounded ${
            selectedCategory === "Battery" ? "bg-primary text-white" : ""
          }`}
          onClick={() => setSelectedCategory("Battery")}
        >
          Battery
        </button>
        <button
          className={`px-3 py-1 border rounded ${
            selectedCategory === "Panel" ? "bg-primary text-white" : ""
          }`}
          onClick={() => setSelectedCategory("Panel")}
        >
          Panel
        </button>
      </div>

      {/* Filtered Product Grid */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {products
          ?.filter((p) =>
            p.category?.name
              ?.toLowerCase()
              .includes(selectedCategory.toLowerCase())
          )
          ?.map((product) => {
            const isSelected = selectedProducts.find(
              (p) => p.id === product.id
            );
            const price = parseFloat(product.discounted_price || product.price);

            return (
              <div
                key={product.id}
                className={`p-2 border rounded shadow-sm transition ${
                  isSelected ? "ring-2 ring-primary" : ""
                }`}
              >
                <Image
                  src={`${process.env.NEXT_PUBLIC_ASSETS_URL}${product.image}?height=200`}
                  alt={product.name}
                  placeholder="blur"
                  blurDataURL={`${process.env.NEXT_PUBLIC_ASSETS_URL}${product.image}?width=10&quality=1`}
                  width={200}
                  height={200}
                  className="object-contain w-full h-40 bg-imageBgPrimary/20 dark:bg-imageBgPrimaryDark/20"
                />
                <div className="mt-2">
                  <p className="text-sm font-semibold">{product.name}</p>
                  <p className="text-primary font-bold">৳ {price}</p>

                  {isSelected && (
                    <div className="flex items-center justify-between mt-1">
                      <button
                        onClick={() => updateSelectedProductQty(product.id, -1)}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span>{isSelected.quantity}</span>
                      <button
                        onClick={() => updateSelectedProductQty(product.id, 1)}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  <button
                    onClick={() => toggleProductSelection(product.id)}
                    className="mt-2 w-full text-xs px-2 py-1 bg-primary text-background rounded hover:bg-secondary"
                  >
                    {isSelected ? "Remove" : "Select"}
                  </button>
                </div>
              </div>
            );
          })}
      </div>

      {/* Total + Add All to Cart */}
      {selectedProducts.length > 0 && (
        <div className="mt-6 p-4 border-t flex flex-col sm:flex-row justify-between items-center">
          <p className="text-lg font-semibold">
            Total Estimated Cost: ৳ {totalCost}
          </p>
          <button
            onClick={() => {
              selectedProducts.forEach((sel) => {
                const product = products.find((p) => p.id === sel.id);
                if (product) {
                  dispatch(
                    addToCart({
                      ...product,
                      quantity: sel.quantity,
                      price: parseFloat(product.price),
                      ...(product.discounted_price && {
                        discounted_price: parseFloat(product.discounted_price),
                      }),
                    })
                  );
                }
              });

              showCustomToast({
                icon: ShoppingCart,
                message: "All selected products added to cart!",
                id: `added-to-cart`,
              });
            }}
            className="mt-4 sm:mt-0 px-6 py-2 bg-primary text-background rounded hover:bg-secondary"
          >
            <ShoppingCart
              aria-label="Add to Cart"
              className="inline w-4 h-4 mr-2"
            />
            Add All to Cart
          </button>
        </div>
      )}
    </PaddingContainer>
  );
}
