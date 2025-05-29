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

  // Skeleton loader
  if (!cart) {
    return (
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 p-4 border-b animate-pulse">
        <div className="w-full sm:w-1/4 h-24 bg-gray-200 rounded-lg" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
        </div>
        <div className="h-6 w-6 bg-gray-200 rounded-full self-end sm:self-center" />
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 p-4 border-b">
      {/* Left side: Image + Info */}
      <div className="flex items-start sm:items-center gap-4 w-full sm:w-1/2">
        <Image
          src={`${process.env.NEXT_PUBLIC_ASSETS_URL}${cart.image}`}
          alt={cart.name}
          width={90}
          height={90}
          className="rounded-lg object-cover border shrink-0"
        />
        <div className="flex-1">
          <h2 className="text-base font-semibold">{cart.name}</h2>
          <p className="text-sm ">৳ {cart.price.toLocaleString()}</p>

          {/* Total for mobile */}
          <div className="sm:hidden mt-1 text-sm font-medium text-right ">
            Total: BDT {(cart.price * cart.quantity).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Qty + Total + Delete */}
      <div className="flex w-full sm:w-auto justify-between items-center gap-4 sm:gap-6">
        {/* Quantity selector */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium hidden sm:block">Qty:</label>
          <div className="flex items-center border rounded overflow-hidden">
            <button
              onClick={() =>
                handleQuantityChange?.(cart.id, Math.max(1, cart.quantity - 1))
              }
              className="px-2 py-1 text-sm font-bold hover:bg-secondary hover:text-foreground text-background bg-primary"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="px-3 py-1 text-sm">{cart.quantity}</span>
            <button
              onClick={() => handleQuantityChange?.(cart.id, cart.quantity + 1)}
              className="px-2 py-1 text-sm font-bold hover:bg-secondary hover:text-foreground text-background bg-primary"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        </div>

        {/* Total price (desktop only) */}
        <div className="hidden sm:block text-right font-semibold w-24">
          BDT {(cart.price * cart.quantity).toLocaleString()}
        </div>

        {/* Remove button */}
        <button
          onClick={() => dispatch(removeFromCart(cart.id))}
          className="text-red-600 hover:text-red-800"
          title="Remove from cart"
        >
          <Trash className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default CartCard;
