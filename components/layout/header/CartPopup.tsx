"use client";

import { ShoppingCart, Trash } from "lucide-react";
import { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import Image from "next/image";
import { RootState, AppDispatch } from "@/store";
import { removeFromCart } from "@/store/cartSlice";
import { useHasMounted } from "@/hooks/useHasMounted";

const CartPopup = () => {
  const [showPopup, setShowPopup] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const cartItems = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch<AppDispatch>();
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setShowPopup(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setShowPopup(false);
    }, 150); // short delay to allow clicks
  };

  const hasMounted = useHasMounted();
  if (!hasMounted) return null;

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        href="/cart"
        className="ml-3 px-4 py-2 bg-primary hover:bg-secondary  transition text-background hover:text-foreground rounded-full text-sm font-semibold shadow inline-flex items-center gap-2"
      >
        <ShoppingCart className="w-4 h-4" />
        View Cart
        {totalQuantity > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
            {totalQuantity}
          </span>
        )}
      </Link>

      {showPopup && (
        <div className="absolute right-0 mt-3 w-[320px] bg-background shadow-xl border rounded-xl z-50">
          <div className="p-4 max-h-[300px] overflow-y-auto space-y-4">
            {cartItems.length === 0 ? (
              <p className="text-sm text-gray-500">Cart is empty.</p>
            ) : (
              cartItems.map((item) => (
                <div key={item.id} className="flex gap-3 items-start">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_ASSETS_URL}${item.image}`}
                    alt={item.name}
                    width={50}
                    height={50}
                    className="rounded border w-[50px] h-[50px] object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-gray-500">
                      {item.quantity} x {item.price.toLocaleString()}৳
                    </p>
                  </div>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => dispatch(removeFromCart(item.id))}
                    title="Remove item"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
          {cartItems.length > 0 && (
            <div className="p-4 border-t text-center">
              <Link
                href="/cart"
                className="inline-block bg-primary text-background px-4 py-2 rounded-md text-sm hover:bg-secondary hover:text-foreground transition"
              >
                Go to Cart
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CartPopup;
