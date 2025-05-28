import { AppDispatch } from "@/store";
import { ICartItem, removeFromCart } from "@/store/cartSlice";
import { Trash } from "lucide-react";
import Image from "next/image";
import React from "react";
import { useDispatch } from "react-redux";

type THandleQuantityChange = (id: string, newQty: number) => void;

const CartCard = ({
  cart,
  handleQuantityChange,
}: {
  cart?: ICartItem;
  handleQuantityChange?: THandleQuantityChange;
}) => {
  const dispatch = useDispatch<AppDispatch>();

  // 🔁 If cart is not passed, show Skeleton
  if (!cart) {
    return (
      <div className="flex flex-col sm:flex-row gap-6 items-center justify-between border-b pb-6 animate-pulse">
        <div className="w-full sm:w-1/2 flex items-center gap-4">
          <div className="w-24 h-24 bg-gray-200 rounded-lg" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
          </div>
        </div>

        <div className="hidden sm:block w-1/4 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto" />
          <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto" />
        </div>

        <div className="h-6 w-6 bg-gray-200 rounded-full" />
      </div>
    );
  }

  // ✅ Render actual cart item
  return (
    <div
      key={cart.id}
      className="flex flex-col sm:flex-row gap-6 items-center justify-between border-b pb-6"
    >
      <div className="flex items-center gap-4 w-full sm:w-1/2">
        <Image
          src={`${process.env.NEXT_PUBLIC_ASSETS_URL}${cart.image}`}
          alt={cart.name}
          width={90}
          height={90}
          className="rounded-lg object-cover border"
        />
        <div>
          <h2 className="text-lg font-semibold">{cart.name}</h2>
          <p className="text-sm text-gray-600">
            ৳ {cart.price.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <label className="text-sm font-medium">Qty:</label>
        <input
          type="number"
          className="w-16 border rounded px-2 py-1"
          value={cart.quantity}
          min={1}
          onChange={(e) =>
            handleQuantityChange?.(cart.id, parseInt(e.target.value))
          }
        />
      </div>

      <div className="text-right font-semibold text-gray-800 hidden sm:block w-24">
        ৳ {(cart.price * cart.quantity).toLocaleString()}
      </div>

      <button
        onClick={() => dispatch(removeFromCart(cart.id))}
        className="text-red-600 hover:text-red-800"
        title="Remove from cart"
      >
        <Trash className="w-5 h-5" />
      </button>
    </div>
  );
};

export default CartCard;
