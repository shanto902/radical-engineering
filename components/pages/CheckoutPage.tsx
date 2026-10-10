"use client";
import confetti from "canvas-confetti";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useHasMounted } from "@/hooks/useHasMounted";
import { clearCart } from "@/store/cartSlice";
import Link from "next/link";
import {
  ArrowLeftCircle,
  CircleAlert,
  ShoppingCart,
  Loader2,
  Truck,
  Store,
  MapPin,
} from "lucide-react";

import { showCustomToast } from "@/lib/showCustomToast";

export default function CheckoutPage() {
  const [showThankYou, setShowThankYou] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fulfillment Method: 'delivery' (Home Delivery) vs 'pickup' (Store Pickup)
  const [fulfillmentMethod, setFulfillmentMethod] = useState<"delivery" | "pickup">("delivery");
  const [deliveryCharge, setDeliveryCharge] = useState<number>(150);
  const [isLoadingDeliveryCharge, setIsLoadingDeliveryCharge] = useState<boolean>(true);
  const [showroomAddress, setShowroomAddress] = useState<string>(
    "1400, Hazi Hasen Ali Market, Station Road (opposite Medilab), Kishoreganj, Bangladesh"
  );

  const { items } = useSelector((state: RootState) => state.cart);
  const hasMounted = useHasMounted();
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
  });

  // Load delivery charge and showroom address from settings
  useEffect(() => {
    let isMounted = true;
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const settings = await res.json();
          if (isMounted && settings) {
            if (typeof settings.delivery_charge === "number") {
              setDeliveryCharge(settings.delivery_charge);
            }
            if (settings.address) {
              setShowroomAddress(settings.address);
            }
          }
        }
      } catch {
        // Fallback to default 150 BDT
      } finally {
        if (isMounted) {
          setIsLoadingDeliveryCharge(false);
        }
      }
    };

    fetchSettings();
    return () => {
      isMounted = false;
    };
  }, []);

  const itemsSubtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const effectiveDeliveryCharge =
    fulfillmentMethod === "pickup" ? 0 : deliveryCharge;
  const grandTotal = itemsSubtotal + effectiveDeliveryCharge;

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
          name: data.name || prev.name || "",
          address: data.address || prev.address || "",
        }));
      }
    } catch (err) {
      console.error("Failed to fetch address by phone", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      showCustomToast({
        icon: ShoppingCart,
        message: "Your cart is empty. Please add products before checking out",
        id: `empty`,
      });
      return;
    }

    if (!form.name || !form.phone) {
      showCustomToast({
        icon: CircleAlert,
        message: "Please fill out your name and phone number.",
        id: `form-error`,
      });
      return;
    }

    if (fulfillmentMethod === "delivery" && !form.address.trim()) {
      showCustomToast({
        icon: CircleAlert,
        message: "Please enter your delivery address.",
        id: `form-error-address`,
      });
      return;
    }

    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const extraChargesList =
        effectiveDeliveryCharge > 0
          ? [
              {
                name: "Delivery Charge",
                cost: String(effectiveDeliveryCharge),
                amount: effectiveDeliveryCharge,
              },
            ]
          : [];

      const orderAddress =
        fulfillmentMethod === "pickup"
          ? form.address.trim()
            ? `[Store Pickup] ${form.address.trim()}`
            : `[Store Pickup] Showroom Collection: ${showroomAddress}`
          : form.address.trim();

      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          phone: form.phone.trim(),
          address: orderAddress,
          total: grandTotal,
          delivery_charge: effectiveDeliveryCharge,
          extra_charges: extraChargesList,
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
              ?.map((item) => `${item.name} x${item.quantity}`)
              .join(", ")}\nFulfillment: ${
              fulfillmentMethod === "pickup"
                ? "Store Pickup"
                : "Home Delivery"
            }\nDelivery Charge: ${
              effectiveDeliveryCharge > 0
                ? `${effectiveDeliveryCharge.toLocaleString()} BDT`
                : "Free"
            }\nTotal: ${grandTotal.toLocaleString()} BDT\nPhone: ${
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
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error("Order submission error:", err);
      alert("❌ Something went wrong.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* Shipping & Fulfillment Info */}
      <div className="p-4 sm:p-6 order-2 rounded-2xl border bg-background shadow-sm">
        <h1 className="text-2xl font-bold mb-6">Order Details</h1>
        <form onSubmit={handleSubmit} className="space-y-5" autoComplete="on">
          {/* Order Fulfillment Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold">
              Order Fulfillment <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-muted-foreground">
              Choose home delivery or collect in person from showroom
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {/* Option 1: Home Delivery */}
              <button
                type="button"
                onClick={() => setFulfillmentMethod("delivery")}
                className={`p-4 rounded-xl border-2 text-left transition-all flex flex-col justify-between gap-3 ${
                  fulfillmentMethod === "delivery"
                    ? "border-primary bg-primary/5 dark:bg-primary/10 shadow-sm"
                    : "border-neutral-200 dark:border-neutral-800 hover:border-primary/40 bg-background"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      fulfillmentMethod === "delivery"
                        ? "border-primary"
                        : "border-neutral-400"
                    }`}
                  >
                    {fulfillmentMethod === "delivery" && (
                      <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                    )}
                  </div>
                  <Truck
                    className={`w-5 h-5 ${
                      fulfillmentMethod === "delivery"
                        ? "text-primary"
                        : "text-neutral-400"
                    }`}
                  />
                </div>
                <div>
                  <p className="font-bold text-sm text-foreground">
                    Home Delivery
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {isLoadingDeliveryCharge
                      ? "Calculating..."
                      : deliveryCharge > 0
                      ? `৳${deliveryCharge.toLocaleString()} charge`
                      : "Free delivery"}
                  </p>
                </div>
              </button>

              {/* Option 2: Store Pickup */}
              <button
                type="button"
                onClick={() => setFulfillmentMethod("pickup")}
                className={`p-4 rounded-xl border-2 text-left transition-all flex flex-col justify-between gap-3 ${
                  fulfillmentMethod === "pickup"
                    ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 shadow-sm"
                    : "border-neutral-200 dark:border-neutral-800 hover:border-emerald-600/40 bg-background"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      fulfillmentMethod === "pickup"
                        ? "border-emerald-600"
                        : "border-neutral-400"
                    }`}
                  >
                    {fulfillmentMethod === "pickup" && (
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                    )}
                  </div>
                  <Store
                    className={`w-5 h-5 ${
                      fulfillmentMethod === "pickup"
                        ? "text-emerald-600"
                        : "text-neutral-400"
                    }`}
                  />
                </div>
                <div>
                  <p className="font-bold text-sm text-foreground">
                    Pick up from Store
                  </p>
                  <p className="text-xs font-semibold text-emerald-600 mt-0.5">
                    ৳0 Fee (Free)
                  </p>
                </div>
              </button>
            </div>

            {/* Showroom Pickup Info Box */}
            {fulfillmentMethod === "pickup" && (
              <div className="mt-3 p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/80 dark:bg-emerald-950/30 flex items-start gap-3 animate-fade-in">
                <MapPin className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <p className="font-bold text-emerald-800 dark:text-emerald-400">
                    Pickup Showroom Location
                  </p>
                  <p className="text-foreground leading-relaxed">{showroomAddress}</p>
                  <p className="text-muted-foreground italic">
                    Delivery charge is ৳0. Our team will prepare your items for showroom collection.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Phone Number <span className="text-red-500">*</span>{" "}
              <span className="text-xs text-muted-foreground font-normal">
                (11-digit BD number: 01XXXXXXXXX)
              </span>
            </label>
            <input
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              pattern="01[0-9]{9}"
              onBlur={handlePhoneBlur}
              placeholder="01XXXXXXXXX"
              className="w-full border bg-background px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              required
            />
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              autoComplete="name"
              placeholder="e.g. Rahim Uddin"
              className="w-full border bg-background px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              {fulfillmentMethod === "delivery" ? (
                <>
                  Delivery / Installation Address{" "}
                  <span className="text-red-500">*</span>
                </>
              ) : (
                <>
                  Contact Address / Area{" "}
                  <span className="text-xs text-muted-foreground font-normal">
                    (Optional for store pickup)
                  </span>
                </>
              )}
            </label>
            <textarea
              autoComplete="street-address"
              placeholder={
                fulfillmentMethod === "delivery"
                  ? "House #, Road #, Area, District (e.g. Station Road, Kishoreganj Sadar)"
                  : "Your area or home address (Optional)"
              }
              className="w-full border bg-background px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              required={fulfillmentMethod === "delivery"}
            />
          </div>

          {/* Submit */}
          <button
            aria-label="Submit Button"
            type="submit"
            disabled={isSubmitting}
            className="bg-primary text-background font-semibold px-6 py-2 rounded hover:bg-secondary hover:text-foreground transition w-full disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (
              "Confirm Order"
            )}
          </button>
        </form>
      </div>

      {/* Order Summary */}
      <div className="p-4 sm:p-6  order-1 rounded-lg  relative">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
          Order Summary
        </h2>

        <div className="space-y-4 min-h-[200px] flex flex-col justify-center">
          {!hasMounted ? (
            Array.from({ length: 3 })?.map((_, i) => (
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
          ) : items.length === 0 ? (
            <div className="text-center space-y-5 py-6">
              <p className="text-xl font-semibold ">🛒 Your cart is empty!</p>
              <p className="text-sm mb-50 text-foreground">
                Looks like you haven’t added anything yet.
              </p>
              <Link
                aria-label="Shop Button"
                href="/categories"
                className="inline-flex gap-2 items-center bg-primary hover:bg-secondary text-background font-semibold px-6 py-2 rounded transition-all shadow-md hover:shadow-lg "
              >
                Lets Go <ShoppingCart /> for Shopping
              </Link>
            </div>
          ) : (
            items?.map((item) => (
              <div
                key={item.id}
                className="flex flex-row items-center gap-4 border-b pb-4"
              >
                <Image
                  src={`${process.env.NEXT_PUBLIC_ASSETS_URL}${item.image}?width=70&height=70`}
                  placeholder="blur"
                  blurDataURL={`${process.env.NEXT_PUBLIC_ASSETS_URL}${item.image}?width=10&quality=1`}
                  alt={item.name}
                  width={70}
                  height={70}
                  className="rounded border w-[70px] h-[70px] object-contain"
                />
                <div className="flex-1">
                  <Link
                    href={`/categories/${item.category.slug}/${item.slug}`}
                    className="font-medium text-base hover:underline underline-offset-4 text-primary"
                  >
                    {item.name}
                  </Link>
                  <p className="text-sm text-foreground">
                    {item.quantity} × {item.price.toLocaleString()} BDT
                  </p>
                </div>
                <p className="font-semibold text-right w-auto">
                  {(item.price * item.quantity).toLocaleString()} BDT
                </p>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="pt-5 mt-4 border-t space-y-3 pb-12">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Items Subtotal</span>
              <span className="font-semibold text-foreground">
                {itemsSubtotal.toLocaleString()} BDT
              </span>
            </div>

            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground flex items-center gap-1.5">
                {fulfillmentMethod === "pickup" ? (
                  <>
                    <Store className="w-4 h-4 text-emerald-600" />
                    Store Pickup Fee
                  </>
                ) : (
                  <>
                    <Truck className="w-4 h-4 text-primary" />
                    Delivery Charge
                  </>
                )}
              </span>
              {fulfillmentMethod === "pickup" ? (
                <span className="font-bold text-emerald-600">৳0 (Free)</span>
              ) : isLoadingDeliveryCharge ? (
                <span className="text-muted-foreground text-xs">
                  Calculating...
                </span>
              ) : (
                <span
                  className={`font-semibold ${
                    effectiveDeliveryCharge > 0
                      ? "text-foreground"
                      : "text-emerald-600"
                  }`}
                >
                  {effectiveDeliveryCharge > 0
                    ? `${effectiveDeliveryCharge.toLocaleString()} BDT`
                    : "Free Delivery"}
                </span>
              )}
            </div>

            <div className="flex justify-between items-baseline pt-3 border-t">
              <div>
                <p className="text-base sm:text-lg font-bold text-foreground">
                  Total Payable
                </p>
                <p className="text-xs text-muted-foreground">
                  Cash on Delivery / Direct Bank
                </p>
              </div>
              <p className="text-xl sm:text-2xl font-black text-primary">
                {grandTotal.toLocaleString()} BDT
              </p>
            </div>

            <Link
              href="/cart"
              className="flex absolute bottom-2 right-5 flex-col items-end gap-1 text-sm sm:text-base hover:border-b-2 pb-1 hover:border-primary"
            >
              <span className="text-xs">Need Something to change?</span>
              <span className="flex gap-1 items-center">
                <ArrowLeftCircle className="w-5 h-5" />
                Go back to Cart
              </span>
            </Link>
          </div>
        )}
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
