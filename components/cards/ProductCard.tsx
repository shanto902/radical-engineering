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
import { useHasMounted } from "@/hooks/useHasMounted";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const ProductCard = ({ product }: { product: TProduct }) => {
  const hasMounted = useHasMounted();
  const dispatch = useDispatch<AppDispatch>();
  const wishlist = useSelector((state: RootState) => state.wishlist.items);
  const isInWishlist = wishlist.some((item) => item.id === product.id);
  const router = useRouter();
  const handleCart = () => {
    dispatch(
      addToCart({
        id: product.id,
        name: product.name,
        price: parseFloat(product.discounted_price || product.price),
        quantity: 1,
        image: product.image,
        slug: product.slug,
        category: {
          name: product.category.name,
          slug: product.category.slug,
        },
      })
    );
    toast.success("Product added to cart!");
  };
  const handleBuyNow = () => {
    handleCart();
    router.push("/checkout");
  };

  const toggleWishlist = () => {
    if (isInWishlist) {
      dispatch(removeFromWishlist(product.id));
    } else {
      dispatch(
        addToWishlist({
          id: product.id,
          name: product.name,
          price: parseFloat(product.discounted_price || product.price),
          image: product.image,
          slug: product.slug,
          status: product.status,
          category: {
            slug: product.category.slug,
            name: product.category.name,
          },
        })
      );
    }
  };

  // ─────────────────────────────
  // 🔁 Skeleton for Hydration Safety
  if (!hasMounted) {
    return (
      <div className="bg-background border rounded-xl shadow overflow-hidden animate-pulse">
        <div className="w-full h-40 bg-gray-200" />
        <div className="p-4 space-y-2">
          <div className="h-6 bg-gray-200 rounded w-3/4" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
          <div className="h-3 bg-gray-200 rounded w-1/3" />
          <div className="h-5 bg-gray-300 rounded w-1/2 mt-2" />
          <div className="flex gap-2 mt-4">
            <div className="h-9 bg-gray-300 rounded-lg w-1/2" />
            <div className="h-9 bg-gray-300 rounded-lg w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────
  return (
    <div
      key={product.id}
      className="bg-background border hover:bg-primary/10 rounded-xl shadow hover:shadow-md transition overflow-hidden relative flex flex-col justify-between"
    >
      <div>
        <Link
          href={`/categories/${product.category.slug}/${product.slug}`}
          className="relative block aspect-square"
        >
          <Image
            src={`${process.env.NEXT_PUBLIC_ASSETS_URL}${product.image}?height=200`}
            alt={product.name}
            width={200}
            height={200}
            className="w-full dark:bg-imageBgPrimary/20 bg-imageBgPrimaryDark/20  object-contain aspect-square "
          />
          {product.discounted_price && (
            <span className="absolute top-2  left-2 bg-primary text-background  text-xs px-2 py-1 rounded-full font-semibold">
              {Math.round(
                ((parseFloat(product.price) -
                  parseFloat(product.discounted_price)) /
                  parseFloat(product.price)) *
                  100
              )}
              %
            </span>
          )}
        </Link>

        {/* Wishlist Button */}
        <button
          aria-label="Toggle Wishlist"
          onClick={toggleWishlist}
          className="absolute top-2 right-2 p-1 bg-foreground text-back  rounded-full shadow hover:bg-primary transition"
        >
          {isInWishlist ? (
            <X className="text-red-500 w-5 h-5" />
          ) : (
            <Heart className="text-background  hover:text-background w-5 h-5" />
          )}
        </button>

        <Link
          href={`/categories/${product.category.slug}/${product.slug}`}
          className=""
        >
          <div className="px-4 pt-2">
            <h3 className="text-base font-bold mb-1 line-clamp-2">
              {product.name}
            </h3>
            <p className="text-xs text-primary mb-2 ">
              {product.category.name}
            </p>
          </div>
        </Link>
      </div>
      <div className="px-4 pb-4">
        <p className="text-sm font-semibold mb-1">
          {product.status === "in-stock" && (
            <span className="text-green-900 dark:text-green-400 flex items-center gap-1">
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
            <span className="line-through  text-sm mr-2">
              {product.price.toLocaleString()}৳
            </span>
          )}
          <span className="text-foreground font-bold text-lg">
            {(product.discounted_price || product.price).toLocaleString()}৳
          </span>
        </div>

        <div className="flex flex-col md:flex-row gap-2">
          <button
            aria-label="Add To Cart"
            onClick={() =>
              product.status === "in-stock"
                ? handleCart()
                : toast.error("Product Not Available")
            }
            className="w-full bg-primary hover:bg-secondary text-background hover:text-foreground text-sm py-2 rounded-lg font-semibold transition"
          >
            Add To Cart
          </button>

          <button
            aria-label="Buy Now"
            onClick={() =>
              product.status === "in-stock"
                ? handleBuyNow()
                : toast.error("Product Not Available")
            }
            className="w-full bg-secondary hover:bg-primary text-foreground hover:text-background text-sm py-2 rounded-lg font-semibold transition"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
