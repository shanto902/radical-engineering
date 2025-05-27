"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/store";
import Image from "next/image";
import { useState } from "react";

export default function CheckoutPage() {
  const { items } = useSelector((state: RootState) => state.cart);
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

    // Simulate order placement
    alert("✅ Order placed successfully!");
    console.log("Order Info:", form);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* Left - Shipping Info */}
      <div>
        <h1 className="text-2xl font-bold mb-6">Shipping Information</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium">Full Name</label>
            <input
              type="text"
              className="w-full border px-4 py-2 rounded"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Phone Number</label>
            <input
              type="tel"
              className="w-full border px-4 py-2 rounded"
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
              className="w-full border px-4 py-2 rounded"
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
      <div>
        <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 border-b pb-4"
            >
              <Image
                src={`${process.env.NEXT_PUBLIC_ASSETS_URL}${item.image}`}
                alt={item.title}
                width={70}
                height={70}
                className="rounded object-cover"
              />
              <div className="flex-1">
                <p className="font-medium">{item.title}</p>
                <p className="text-sm text-gray-500">
                  {item.quantity} × {item.price.toLocaleString()}৳
                </p>
              </div>
              <p className="font-semibold">
                {(item.price * item.quantity).toLocaleString()}৳
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 border-t pt-4">
          <p className="text-xl font-bold">Total: {total.toLocaleString()}৳</p>
        </div>
      </div>
    </div>
  );
}
