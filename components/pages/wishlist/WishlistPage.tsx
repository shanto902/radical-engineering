"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { addToCart } from "@/store/cartSlice";
import { removeFromWishlist } from "@/store/wishlistSlice";
import Image from "next/image";
import Link from "next/link";
import { Heart, HeartCrack, ShoppingCart, Trash2 } from "lucide-react";
import PaddingContainer from "@/components/common/PaddingContainer";
import { useHasMounted } from "@/hooks/useHasMounted";
import toast from "react-hot-toast";

const WishlistPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const items = useSelector((state: RootState) => state.wishlist.items);

  const hasMounted = useHasMounted();
  if (!hasMounted) return null;

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto flex flex-col items-center justify-center px-4 py-20 text-center h-[70vh]">
        <h1 className="md:text-3xl text-xl font-bold mb-4 flex items-center gap-5 justify-center">
          Your Wishlist is Empty <HeartCrack />{" "}
        </h1>
        <p className="text-gray-500 mb-6">
          Save your favorite products and come back later!
        </p>
        <Link
          href="/categories"
          className="inline-block bg-primary text-background px-4 py-2 rounded-lg hover:bg-secondary hover:text-foreground transition font-semibold"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <PaddingContainer className="py-20">
      <h1 className="md:text-3xl text-xl uppercase font-bold mb-12 text-center flex items-center justify-center gap-2">
        <Heart className="size-10 text-primary" />
        Your Wishlist
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {items.map((product) => {
          const showDiscount =
            product.discounted_price &&
            product.discounted_price < product.price;

          return (
            <div
              key={product.id}
              className="border rounded-xl p-4 shadow-sm hover:shadow-md transition relative group"
            >
              {/* Product Image */}
              <Image
                src={`${process.env.NEXT_PUBLIC_ASSETS_URL}${product.image}`}
                alt={product.name}
                width={400}
                height={300}
                className={`w-full h-48 object-cover mb-4 rounded transition ${
                  product.status !== "in-stock" ? "opacity-50 grayscale" : ""
                }`}
              />

              {/* Product Title */}
              {product.status === "in-stock" ? (
                <Link
                  href={`/categories/${product?.category?.slug}/${product.slug}`}
                  className="block hover:text-primary transition"
                >
                  <h3 className="text-lg font-semibold hover:underline">
                    {product.name}
                  </h3>
                </Link>
              ) : (
                <h3 className="text-lg font-semibold text-gray-400 cursor-not-allowed">
                  {product.name} (Not Available)
                </h3>
              )}

              {/* Price */}
              <div className="mt-1 text-lg font-bold">
                {showDiscount ? (
                  <div className="text-primary">
                    ৳{" "}
                    {product.discounted_price &&
                      product.discounted_price.toLocaleString()}{" "}
                    <span className="text-gray-400 line-through text-sm ml-1">
                      ৳ {product.price.toLocaleString()}
                    </span>
                  </div>
                ) : (
                  <p className="text-primary">
                    ৳ {product.price.toLocaleString()}
                  </p>
                )}
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-between mt-4">
                <button
                  onClick={() => {
                    if (product.status === "in-stock") {
                      dispatch(
                        addToCart({
                          ...product,
                          quantity: 1,
                        })
                      );
                      toast.success("Product added to cart!");
                    }
                  }}
                  disabled={product.status !== "in-stock"}
                  title={
                    product.status === "in-stock"
                      ? "Add this item to your cart"
                      : "Product is out of stock"
                  }
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded transition ${
                    product.status === "in-stock"
                      ? "bg-primary text-background hover:bg-secondary hover:text-foreground"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  Add to Cart
                </button>

                <button
                  onClick={() => {
                    dispatch(removeFromWishlist(product.id));
                    toast("Removed from wishlist", {
                      icon: "💔",
                    });
                  }}
                  title="Remove from wishlist"
                  className="text-red-500 hover:text-red-700 transition"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </PaddingContainer>
  );
};

export default WishlistPage;
