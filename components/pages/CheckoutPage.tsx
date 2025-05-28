"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/store";
import Image from "next/image";
import { useState } from "react";
import { useHasMounted } from "@/hooks/useHasMounted";

export default function CheckoutPage() {
  const { items } = useSelector((state: RootState) => state.cart);
  const hasMounted = useHasMounted();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.address) {
      alert("Please fill out all fields");
      return;
    }

    alert("✅ Order placed successfully!");
    console.log("Order Info:", form);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* Left - Shipping Info */}
      <div className="bg-white p-6 shadow-md rounded-lg border">
        <h1 className="text-2xl font-bold mb-6">Shipping Information</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium">Full Name</label>
            <input
              type="text"
              className="w-full border px-4 py-2 rounded focus:outline-primary"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Phone Number</label>
            <input
              type="tel"
              className="w-full border px-4 py-2 rounded focus:outline-primary"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">
              Shipping Address
            </label>
            <textarea
              className="w-full border px-4 py-2 rounded focus:outline-primary"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              required
            />
          </div>

          <button
            type="submit"
            className="bg-primary text-white font-semibold px-6 py-2 rounded hover:bg-yellow-500 hover:text-black transition"
          >
            Confirm Order
          </button>
        </form>
      </div>

      {/* Right - Order Summary */}
      <div className="bg-white p-6 shadow-md rounded-lg border">
        <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
        <div className="space-y-4">
          {!hasMounted
            ? Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 border-b pb-4 animate-pulse"
                >
                  <div className="w-[70px] h-[70px] bg-gray-200 rounded" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                  <div className="h-5 w-16 bg-gray-200 rounded" />
                </div>
              ))
            : items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 border-b pb-4"
                >
                  <Image
                    src={`${process.env.NEXT_PUBLIC_ASSETS_URL}${item.image}`}
                    alt={item.name}
                    width={70}
                    height={70}
                    className="rounded object-cover border"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      {item.quantity} × {item.price.toLocaleString()}BDT
                    </p>
                  </div>
                  <p className="font-semibold text-right">
                    {(item.price * item.quantity).toLocaleString()}BDT
                  </p>
                </div>
              ))}
        </div>

        <div className="mt-6  pt-4">
          <p className="text-xl font-bold">
            Total: {total.toLocaleString()}BDT
          </p>
        </div>
      </div>
    </div>
  );
}
