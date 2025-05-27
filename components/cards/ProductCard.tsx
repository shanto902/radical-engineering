import { TProduct } from "@/interfaces";
import Image from "next/image";
import React from "react";

const ProductCard = ({ product }: { product: TProduct }) => {
  return (
    <div
      key={product.id}
      className="bg-white border rounded-xl shadow hover:shadow-md transition overflow-hidden"
    >
      <div className="relative">
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
      </div>

      <div className="p-4">
        <h3 className="text-base font-bold mb-1">{product.name}</h3>
        <p className="text-xs text-gray-500 mb-2">{product.category.name}</p>

        {/* <div className="flex items-center text-yellow-400 text-sm mb-1">
          {Array.from({ length: product.rating }).map((_, idx) => (
            <Star key={idx} fill="currentColor" className="w-4 h-4" />
          ))}
        </div> */}

        <p className="flex items-center text-primary text-sm font-semibold mb-1">
          {product.status === "in-stock"
            ? "✔ In stock"
            : product.status === "out-of-stock"
            ? "Out of Stock"
            : product.status === "pre-order" && "Pre Order"}
        </p>

        <div className="mb-3">
          {product.discounted_price && (
            <span className="line-through text-gray-400 text-sm mr-2">
              {product.price.toLocaleString()}৳
            </span>
          )}
          <span className="text-green-600 font-bold text-lg">
            {product.discounted_price
              ? product.discounted_price.toLocaleString()
              : product.price.toLocaleString()}
            ৳
          </span>
        </div>

        <div className="flex gap-2">
          <button className="w-full bg-primary hover:bg-yellow-400 text-white hover:text-black text-sm py-2 rounded-lg font-semibold transition">
            Add To Cart
          </button>{" "}
          <button className="w-full bg-green-800 hover:bg-yellow-400 text-white hover:text-black text-sm py-2 rounded-lg font-semibold transition">
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
