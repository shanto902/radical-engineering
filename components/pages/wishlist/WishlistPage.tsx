"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { addToCart } from "@/store/cartSlice";
import { removeFromWishlist } from "@/store/wishlistSlice";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import PaddingContainer from "@/components/common/PaddingContainer";
import { useHasMounted } from "@/hooks/useHasMounted";

const WishlistPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const items = useSelector((state: RootState) => state.wishlist.items);

  const hasMounted = useHasMounted();
  if (!hasMounted) return null;

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Your Wishlist is Empty 💔</h1>
        <p className="text-gray-500 mb-6">
          Save your favorite products and come back later!
        </p>
        <Link
          href="/categories"
          className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-yellow-500 hover:text-black transition font-semibold"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <PaddingContainer className=" py-20">
      <h1 className="text-3xl uppercase font-bold mb-12 text-center flex items-center justify-center gap-2">
        {" "}
        <span>
          <Heart className="size-10 text-primary" />
        </span>{" "}
        Your Wishlist
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {items.map((product) => (
          <div
            key={product.id}
            className="border rounded-xl p-4 shadow-sm hover:shadow-md transition relative group"
          >
            <Image
              src={`${process.env.NEXT_PUBLIC_ASSETS_URL}${product.image}`}
              alt={product.name}
              width={400}
              height={300}
              className="w-full h-48 object-cover mb-4 rounded"
            />
            <h3 className="text-lg font-semibold text-gray-800">
              {product.name}
            </h3>
            <p className="text-primary font-bold text-lg mt-1">
              ৳ {product.price.toLocaleString()}
            </p>

            <div className="flex items-center justify-between mt-4">
              <button
                onClick={() =>
                  dispatch(
                    addToCart({
                      ...product,
                      quantity: 1,
                    })
                  )
                }
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded hover:bg-yellow-500 hover:text-black transition"
              >
                <ShoppingCart className="w-4 h-4" />
                Add to Cart
              </button>

              <button
                onClick={() => dispatch(removeFromWishlist(product.id))}
                className="text-red-500 hover:text-red-700 transition"
                title="Remove from wishlist"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </PaddingContainer>
  );
};

export default WishlistPage;
