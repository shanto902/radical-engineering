"use client";

import { ShoppingCart, Trash } from "lucide-react";
import { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import Image from "next/image";
import { RootState, AppDispatch } from "@/store";
import {
  removeFromCart,
  incrementQuantity,
  decrementQuantity,
} from "@/store/cartSlice";
import { useHasMounted } from "@/hooks/useHasMounted";

const CartPopup = () => {
  const [showPopup, setShowPopup] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const cartItems = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch<AppDispatch>();
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setShowPopup(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setShowPopup(false);
    }, 150);
  };

  const hasMounted = useHasMounted();
  if (!hasMounted) return null;

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link href="/cart" className="">
        <ShoppingCart />

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
              <p className="text-sm ">Cart is empty.</p>
            ) : (
              cartItems.map((item) => (
                <div key={item.id} className="flex gap-3 items-start">
                  <Link href={`/categories/${item.category.slug}/${item.slug}`}>
                    <Image
                      src={`${process.env.NEXT_PUBLIC_ASSETS_URL}${item.image}`}
                      alt={item.name}
                      width={50}
                      height={50}
                      className="rounded border w-[50px] h-[50px] object-cover"
                    />
                  </Link>
                  <div className="flex-1">
                    <Link
                      href={`/categories/${item.category.slug}/${item.slug}`}
                      className="text-sm font-medium text-primary hover:under"
                    >
                      {item.name}
                    </Link>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 mt-1">
                        <button
                          aria-label="Quantity Decrement"
                          onClick={() => dispatch(decrementQuantity(item.id))}
                          className="w-6 h-6 rounded bg-primary text-sm font-bold hover:bg-secondary text-background hover:text-foreground"
                        >
                          −
                        </button>
                        <span className="text-sm w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          aria-label="Quantity Increment"
                          onClick={() => dispatch(incrementQuantity(item.id))}
                          className="w-6 h-6 rounded bg-primary text-sm font-bold hover:bg-secondary text-background hover:text-foreground"
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
                    aria-label="Remove item from cart"
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
            <div className="p-4 border-t space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span className="font-bold">Subtotal:</span>
                <span>{subtotal.toLocaleString()} BDT</span>
              </div>
              <Link
                href="/checkout"
                className="inline-block bg-primary text-background px-4 py-2 rounded-md text-sm hover:bg-secondary hover:text-foreground transition w-full text-center"
              >
                Go to Checkout
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CartPopup;
