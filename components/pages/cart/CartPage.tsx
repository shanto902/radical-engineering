"use client";

import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { updateQuantity, clearCart } from "@/store/cartSlice";
import Link from "next/link";
import CartCard from "@/components/cards/CartCard";
import { useHasMounted } from "@/hooks/useHasMounted";
import { ShoppingCart, Trash } from "lucide-react";

const CartPage = () => {
  const hasMounted = useHasMounted();
  const dispatch = useDispatch<AppDispatch>();
  const { items } = useSelector((state: RootState) => state.cart);

  const handleQuantityChange = (id: string, newQty: number) => {
    if (newQty >= 1) {
      dispatch(updateQuantity({ id, quantity: newQty }));
    }
  };

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="max-w-7xl min-h-[60vh] mx-auto px-4 mt-16 py-12">
      <h1 className="text-3xl uppercase font-bold mb-12 text-center flex items-center justify-center gap-2">
        {" "}
        <span>
          <ShoppingCart className="size-10 text-primary" />
        </span>{" "}
        Your Shopping Cart
      </h1>

      {/* Show skeletons during SSR hydration */}
      {!hasMounted ? (
        <div className="space-y-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <CartCard key={i} />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center text-lg">Your cart is currently empty.</div>
      ) : (
        <>
          <div className="space-y-8">
            {items.map((item) => (
              <CartCard
                cart={item}
                handleQuantityChange={handleQuantityChange}
                key={item.id}
              />
            ))}
          </div>

          <div className="mt-12  pt-8 grid md:grid-cols-2 gap-8 items-start">
            {/* Left: Clear Cart */}
            <div>
              <button
                onClick={() => dispatch(clearCart())}
                className="text-base flex items-center gap-2 font-bold bg-red-600 rounded-md text-white hover:bg-primary hover:text-background transition-all duration-200 p-2"
              >
                <Trash /> Clear Cart
              </button>
            </div>

            {/* Right: Total + Checkout */}
            <div className=" border rounded-xl p-6 space-y-4 shadow-sm">
              <div className="flex justify-between text-lg font-medium">
                <span>Total:</span>
                <span>{total.toLocaleString()} BDT</span>
              </div>
              <Link
                href="/checkout"
                className="block text-center bg-primary text-background py-3 px-6 rounded-lg hover:bg-secondary hover:text-foreground font-semibold transition"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
