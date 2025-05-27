"use client";

import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { removeFromCart, updateQuantity, clearCart } from "@/store/cartSlice";
import Image from "next/image";
import Link from "next/link";
import { Trash } from "lucide-react";

const CartPage = () => {
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
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

      {items.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <>
          <div className="space-y-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col md:flex-row items-center gap-6 border-b pb-6"
              >
                <Image
                  src={`${process.env.NEXT_PUBLIC_ASSETS_URL}${item.image}`}
                  alt={item.title}
                  width={100}
                  height={100}
                  className="rounded object-cover"
                />
                <div className="flex-1 w-full">
                  <h2 className="text-lg font-semibold">{item.title}</h2>
                  <p className="text-sm text-gray-600">
                    Price: {item.price.toLocaleString()}৳
                  </p>
                  <div className="mt-3 flex items-center gap-3">
                    <label className="text-sm">Qty:</label>
                    <input
                      type="number"
                      className="w-16 border rounded px-2 py-1"
                      value={item.quantity}
                      min={1}
                      onChange={(e) =>
                        handleQuantityChange(item.id, parseInt(e.target.value))
                      }
                    />
                  </div>
                </div>
                <button
                  onClick={() => dispatch(removeFromCart(item.id))}
                  className="text-red-600 hover:text-red-800"
                  title="Remove"
                >
                  <Trash className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          <div className="mt-10 border-t pt-6 flex justify-between items-center">
            <div>
              <button
                onClick={() => dispatch(clearCart())}
                className="text-sm text-red-500 hover:underline"
              >
                Clear Cart
              </button>
            </div>
            <div className="text-right">
              <p className="text-xl font-semibold mb-2">
                Total: {total.toLocaleString()}৳
              </p>
              <Link
                href="/checkout"
                className="bg-green-700 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium transition"
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
