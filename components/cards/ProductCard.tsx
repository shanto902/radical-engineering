"use client";

import { TProduct } from "@/interfaces";
import { CheckCircle, Clock, Heart, X, XCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { addToCart } from "@/store/cartSlice";
import { addToWishlist, removeFromWishlist } from "@/store/wishlistSlice";

const ProductCard = ({ product }: { product: TProduct }) => {
  const dispatch = useDispatch<AppDispatch>();
  const wishlist = useSelector((state: RootState) => state.wishlist.items);

  const isInWishlist = wishlist.some((item) => item.id === product.id);

  const handleCart = () => {
    dispatch(
      addToCart({
        id: product.id,
        title: product.name,
        price: product.discounted_price || product.price,
        quantity: 1,
        image: product.image,
      })
    );
  };

  const toggleWishlist = () => {
    if (isInWishlist) {
      dispatch(removeFromWishlist(product.id));
    } else {
      dispatch(
        addToWishlist({
          id: product.id,
          title: product.name,
          price: product.discounted_price || product.price,
          image: product.image,
        })
      );
    }
  };

  return (
    <div
      key={product.id}
      className="bg-white border rounded-xl shadow hover:shadow-md transition overflow-hidden relative"
    >
      <Link
        href={`/categories/${product.category.slug}/${product.slug}`}
        className="relative block"
      >
        <Image
          src={`${process.env.NEXT_PUBLIC_ASSETS_URL}${product.image}`}
          alt={product.name}
          width={400}
          height={400}
          className="w-full h-60 object-cover"
        />
        <span className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded-full font-semibold">
          {product.discounted_price
            ? `-${Math.round(
                ((product.price - product.discounted_price) / product.price) *
                  100
              )}%`
            : "New"}
        </span>
      </Link>

      {/* Wishlist Button */}
      <button
        onClick={toggleWishlist}
        className="absolute top-2 right-2 p-1 bg-white rounded-full shadow hover:bg-gray-100 transition"
      >
        {isInWishlist ? (
          <X className="text-red-500 w-5 h-5" />
        ) : (
          <Heart className="text-gray-500 w-5 h-5" />
        )}
      </button>

      <div className="p-4">
        <h3 className="text-base font-bold mb-1">{product.name}</h3>
        <p className="text-xs text-gray-500 mb-2">{product.category.name}</p>

        <p className="text-sm font-semibold mb-1">
          {product.status === "in-stock" && (
            <span className="text-green-600 flex items-center gap-1">
              <CheckCircle size={16} />
              In Stock
            </span>
          )}
          {product.status === "out-of-stock" && (
            <span className="text-red-500 flex items-center gap-1">
              <XCircle size={16} />
              Out of Stock
            </span>
          )}
          {product.status === "pre-order" && (
            <span className="text-yellow-500 flex items-center gap-1">
              <Clock size={16} />
              Pre Order
            </span>
          )}
        </p>

        <div className="mb-3">
          {product.discounted_price && (
            <span className="line-through text-gray-400 text-sm mr-2">
              {product.price.toLocaleString()}৳
            </span>
          )}
          <span className="text-black font-bold text-lg">
            {(product.discounted_price || product.price).toLocaleString()}৳
          </span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleCart}
            className="w-full bg-primary hover:bg-yellow-400 text-white hover:text-black text-sm py-2 rounded-lg font-semibold transition"
          >
            Add To Cart
          </button>
          <button className="w-full bg-green-800 hover:bg-yellow-400 text-white hover:text-black text-sm py-2 rounded-lg font-semibold transition">
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
