"use client";

import { X, Trash } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import {
  removeFromCart,
  incrementQuantity,
  decrementQuantity,
} from "@/store/cartSlice";
import { closeCartSidebar } from "@/store/cartUISlice";
import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";

const MobileCartSidebar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const isOpen = useSelector((state: RootState) => state.cartUI.isSidebarOpen);

  // Prevent scrolling when sidebar is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div
      className={`fixed inset-0 z-50 transform transition-transform backdrop-blur-sm duration-300 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => dispatch(closeCartSidebar())}
      />

      {/* Sidebar */}
      <div className="absolute right-0 top-0 h-full w-80 max-w-[90%] bg-background shadow-xl border-l border-gray-200 z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-bold">Your Cart</h2>
          <button onClick={() => dispatch(closeCartSidebar())}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 p-4 overflow-y-auto">
          {cartItems.length === 0 ? (
            <p className="text-sm text-gray-500">Your cart is empty.</p>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="flex items-start gap-3 mb-4">
                <Image
                  src={`${process.env.NEXT_PUBLIC_ASSETS_URL}${item.image}`}
                  alt={item.name}
                  width={50}
                  height={50}
                  className="rounded border w-[50px] h-[50px] object-cover"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium">{item.name}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 mt-1">
                      <button
                        onClick={() => dispatch(decrementQuantity(item.id))}
                        className="w-6 h-6 rounded bg-primary text-sm font-bold hover:bg-secondary hover:text-foreground text-background"
                      >
                        −
                      </button>
                      <span className="text-sm w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => dispatch(incrementQuantity(item.id))}
                        className="w-6 h-6 rounded bg-primary text-sm font-bold hover:bg-secondary hover:text-foreground text-background"
                      >
                        +
                      </button>
                    </div>
                    <p className="text-xs  mt-1">
                      {(item.quantity * item.price).toLocaleString()} BDT
                    </p>
                  </div>
                </div>
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => dispatch(removeFromCart(item.id))}
                >
                  <Trash className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="p-4 border-t space-y-2">
            <div className="flex justify-between text-sm font-medium">
              <span>Subtotal:</span>
              <span>{subtotal.toLocaleString()} BDT</span>
            </div>
            <Link
              href="/checkout"
              className="block bg-primary text-background text-center rounded-md py-2 hover:bg-secondary hover:text-foreground transition"
              onClick={() => dispatch(closeCartSidebar())}
            >
              Go to Checkout
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileCartSidebar;
