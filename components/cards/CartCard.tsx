import { AppDispatch } from "@/store";
import { ICartItem, removeFromCart } from "@/store/cartSlice";
import { Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
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
        {/* Image Skeleton */}
        <div className="w-[90px] h-[90px] bg-gray-300 rounded-lg border shrink-0" />

        {/* Text Skeleton */}
        <div className="flex-1 w-full space-y-3">
          {/* Name */}
          <div className="h-4 w-3/4 bg-gray-300 rounded" />
          {/* Price + Quantity (side-by-side) */}
          <div className="flex justify-between items-center">
            <div className="h-4 w-1/4 bg-gray-300 rounded" />
            <div className="flex gap-2">
              <div className="h-6 w-6 bg-gray-300 rounded" />
              <div className="h-6 w-6 bg-gray-300 rounded" />
              <div className="h-6 w-6 bg-gray-300 rounded" />
            </div>
          </div>
          {/* Total */}
          <div className="h-4 w-1/3 bg-gray-300 rounded ml-auto" />
        </div>

        {/* Desktop-only controls */}
        <div className="hidden sm:flex gap-6 items-center">
          {/* Qty */}
          <div className="h-8 w-24 bg-gray-300 rounded" />
          {/* Total */}
          <div className="h-6 w-20 bg-gray-300 rounded" />
          {/* Trash */}
          <div className="h-6 w-6 bg-gray-300 rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex relative flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 p-4 border-b">
      {/* Left: Image + Name + Price */}
      <div className="flex items-start sm:items-center gap-4 w-full sm:w-1/2">
        <Link href={`/categories/${cart.category.slug}/${cart.slug}`}>
          <Image
            src={`${process.env.NEXT_PUBLIC_ASSETS_URL}${cart.image}?width=90&height=90`}
            alt={cart.name}
            width={90}
            height={90}
            className="rounded-lg object-contain border shrink-0"
          />
        </Link>
        <div className="flex-1">
          <Link
            href={`/categories/${cart.category.slug}/${cart.slug}`}
            className="text-base font-semibold hover:underline text-primary"
          >
            {cart.name}
          </Link>

          {/* Price + Quantity (side-by-side on mobile) */}
          <div className="flex flex-col sm:hidden mt-1 gap-2">
            <div className="flex justify-between items-center">
              <p className="text-sm">৳ {Number(cart.price).toLocaleString()}</p>

              <div className="flex items-center border rounded overflow-hidden">
                <button
                  aria-label="Add To Cart"
                  onClick={() =>
                    handleQuantityChange?.(
                      cart.id,
                      Math.max(1, cart.quantity - 1)
                    )
                  }
                  className="px-2 py-1 text-sm font-bold hover:bg-secondary hover:text-foreground text-background bg-primary"
                >
                  −
                </button>
                <span className="px-3 py-1 text-sm min-w-[24px] text-center">
                  {cart.quantity}
                </span>
                <button
                  aria-label="Quantity Up"
                  onClick={() =>
                    handleQuantityChange?.(cart.id, cart.quantity + 1)
                  }
                  className="px-2 py-1 text-sm font-bold hover:bg-secondary hover:text-foreground text-background bg-primary"
                >
                  +
                </button>
              </div>
            </div>

            {/* Total (below qty) */}
            <div className="text-right text-sm font-semibold text-white">
              Total: ৳{" "}
              {(Number(cart.price) * Number(cart.quantity)).toLocaleString()}
            </div>
          </div>

          {/* Desktop total only */}
          <div className="hidden sm:block text-sm mt-1">
            <p className="text-gray-600">
              ৳ {cart.price.toLocaleString()} × {cart.quantity} ={" "}
              <span className="font-semibold">
                ৳ {(cart.price * cart.quantity).toLocaleString()}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Desktop Qty + Remove */}
      <div className="hidden sm:flex items-center gap-4 sm:gap-6">
        {/* Qty */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium hidden sm:block">Qty:</label>
          <div className="flex items-center border rounded overflow-hidden">
            <button
              aria-label="Quantity Down"
              onClick={() =>
                handleQuantityChange?.(cart.id, Math.max(1, cart.quantity - 1))
              }
              className="px-2 py-1 text-sm font-bold hover:bg-secondary hover:text-foreground text-background bg-primary"
            >
              −
            </button>
            <span className="px-3 py-1 text-sm">{cart.quantity}</span>
            <button
              aria-label="Add To Cart"
              onClick={() => handleQuantityChange?.(cart.id, cart.quantity + 1)}
              className="px-2 py-1 text-sm font-bold hover:bg-secondary hover:text-foreground text-background bg-primary"
            >
              +
            </button>
          </div>
        </div>

        {/* Total */}
        <div className="text-right font-semibold w-24">
          ৳ {(cart.price * cart.quantity).toLocaleString()}
        </div>

        {/* Remove */}
        <button
          aria-label="Remove From Cart"
          onClick={() => dispatch(removeFromCart(cart.id))}
          className="bg-red-600 p-2 text-white rounded-full hover:bg-primary hover:text-background"
        >
          <Trash className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile remove icon (optional, if not visible elsewhere) */}
      <div className="sm:hidden mt-3 absolute -top-2 -left-2 text-right">
        <button
          aria-label="Remove From Cart"
          onClick={() => dispatch(removeFromCart(cart.id))}
          className="text-white p-2 bg-red-600 rounded-full"
          title="Remove from cart"
        >
          <Trash className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default CartCard;
