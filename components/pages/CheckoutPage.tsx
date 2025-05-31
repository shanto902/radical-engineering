"use client";
import confetti from "canvas-confetti";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import Image from "next/image";
import { useState } from "react";
import { useHasMounted } from "@/hooks/useHasMounted";
import { clearCart } from "@/store/cartSlice";
import Link from "next/link";
import { ArrowLeftCircle } from "lucide-react";

export default function CheckoutPage() {
  const [showThankYou, setShowThankYou] = useState(false);

  const { items } = useSelector((state: RootState) => state.cart);
  const hasMounted = useHasMounted();
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handlePhoneBlur = async () => {
    if (!form.phone.match(/^01[0-9]{9}$/)) return; // Only valid BD numbers

    try {
      const res = await fetch("/api/last-order-by-phone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: form.phone }),
      });

      const data = await res.json();

      if (data?.found) {
        setForm((prev) => ({
          ...prev,
          name: data.name || "",
          address: data.address || "",
        }));
      }
    } catch (err) {
      console.error("Failed to fetch address by phone", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.address) {
      alert("Please fill out all fields");
      return;
    }

    try {
      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          total,
          items,
        }),
      });

      const data = await res.json();

      if (data.success) {
        // Send Gotify notification
        await fetch("/api/notify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: `🛒 New Order from ${form.name}`,
            message: `Order of ${items.length} item(s):\n${items
              .map((item) => `${item.name} x${item.quantity}`)
              .join(", ")}\nTotal: ${total.toLocaleString()} BDT\nPhone: ${
              form.phone
            }`,
          }),
        });

        // Clear cart and reset form
        dispatch(clearCart());
        setForm({ name: "", phone: "", address: "" });
        setShowThankYou(true);

        // Launch confetti
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
        });

        setTimeout(() => {
          window.location.href = "/";
        }, 4000);
      } else {
        alert("❌ Failed to place order");
      }
    } catch (err) {
      console.error("Order submission error:", err);
      alert("❌ Something went wrong.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* Shipping Info */}
      <div className=" p-6 shadow-md order-2 rounded-lg border">
        <h1 className="text-2xl font-bold mb-6">Shipping Information</h1>
        <form onSubmit={handleSubmit} className="space-y-5" autoComplete="on">
          {/* Phone Number */}
          <div>
            <label className="block text-sm font-semibold mb-1 ">
              Phone Number{" "}
              <span className="text-xs text-gray-500">(e.g. 01XXXXXXXXX)</span>
            </label>
            <input
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              pattern="01[0-9]{9}"
              onBlur={handlePhoneBlur}
              placeholder="01XXXXXXXXX"
              className="w-full border   bg-background  px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              required
            />
          </div>
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold mb-1 ">
              Full Name
            </label>
            <input
              type="text"
              autoComplete="name"
              placeholder="e.g. Rahim Uddin"
              className="w-full border  bg-background px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-semibold mb-1 ">
              Shipping Address
            </label>
            <textarea
              autoComplete="street-address"
              placeholder="House #, Road #, Area, City"
              className="w-full border bg-background  px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="bg-primary text-background font-semibold px-6 py-2 rounded hover:bg-secondary hover:text-foreground transition w-full"
          >
            Confirm Order
          </button>
        </form>
      </div>

      {/* Order Summary */}
      <div className="p-4 sm:p-6 shadow-md order-1 rounded-lg border relative">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
          Order Summary
        </h2>

        <div className="space-y-4 ">
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
                  className="flex flex-row items-center gap-4 border-b pb-4"
                >
                  <Image
                    src={`${process.env.NEXT_PUBLIC_ASSETS_URL}${item.image}`}
                    alt={item.name}
                    width={70}
                    height={70}
                    className="rounded border w-[70px] h-[70px] object-contain"
                  />
                  <div className="flex-1">
                    <Link
                      href={`/categories/${item.category.slug}/${item.slug}`}
                      className="font-medium text-base hover:underline underline-offset-2 text-primary"
                    >
                      {item.name}
                    </Link>
                    <p className="text-sm text-gray-500">
                      {item.quantity} × {item.price.toLocaleString()} BDT
                    </p>
                  </div>
                  <p className="font-semibold text-right w-auto">
                    {(item.price * item.quantity).toLocaleString()} BDT
                  </p>
                </div>
              ))}
        </div>

        <div className="  flex flex-col pb-12 items-end gap-4 justify-end py-4">
          <p className="text-lg sm:text-xl font-bold">
            Total: {`${total ? total.toLocaleString() : 0} BDT`}
          </p>
          <Link
            href="/cart"
            className="flex absolute bottom-2 right-5 flex-col items-end gap-1 text-sm sm:text-base hover:border-b-2 pb-1 hover:border-primary"
          >
            <span className="text-xs">
              Need Something to change? <br />{" "}
            </span>
            <span className="flex gap-1 items-center">
              <ArrowLeftCircle className="w-5 h-5 grou" />
              Go back to Cart
            </span>
          </Link>
        </div>
      </div>
      {showThankYou && (
        <div className="fixed inset-0 z-[999] bg-black/80 flex items-center justify-center text-center px-4">
          <div className="text-white animate-fadeInUp space-y-4">
            <h2 className="text-3xl sm:text-5xl font-bold">
              Thank you for your purchase!
            </h2>
            <p className="text-lg sm:text-xl">Our agent will call you soon.</p>
            <p className="text-base text-gray-300">
              Redirecting to homepage...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
