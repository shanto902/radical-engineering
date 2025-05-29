"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Image from "next/image";
import InnerImageZoom from "react-inner-image-zoom";
import Link from "next/link";

import "react-inner-image-zoom/lib/styles.min.css";

import {
  Facebook,
  Twitter,
  X,
  Linkedin,
  Heart,
  CheckCircle,
  XCircle,
  Clock,
  Plus,
  Minus,
} from "lucide-react";

import { AppDispatch, RootState } from "@/store";
import { addToCart } from "@/store/cartSlice";
import { toggleWishlist } from "@/store/wishlistSlice";
import { TProduct } from "@/interfaces";
import PaddingContainer from "@/components/common/PaddingContainer";
import ProductTabs from "./ProductTabs";
import toast from "react-hot-toast";
import { getImageUrl } from "@/utils/image-url";

export default function ProductPage({ product }: { product: TProduct }) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const wishlist = useSelector((state: RootState) => state.wishlist.items);
  const isWishlisted = wishlist.some((item) => item.id === product.id);

  const [selectedImage, setSelectedImage] = useState(product.image);
  const [hasMounted, setHasMounted] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const images = [
    product.image,
    ...(product.image_gallery?.map((img) => img.directus_files_id) || []),
  ];

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        id: product.id,
        name: product.name,
        price: product.discounted_price || product.price,
        image: product.image,
        quantity,
      })
    );
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/checkout");
  };

  return (
    <PaddingContainer className="py-20">
      <div className=" grid grid-cols-1 md:grid-cols-3 gap-10 content-center">
        {/* Image Panel */}
        <div className="">
          <div className="relative border  rounded-xl mb-4 bg-background overflow-hidden">
            {hasMounted && (
              <div key={selectedImage}>
                <InnerImageZoom
                  key={selectedImage}
                  height={500}
                  width={1000}
                  src={getImageUrl(selectedImage)}
                  zoomSrc={getImageUrl(selectedImage)}
                  zoomType="hover"
                  zoomPreload
                  className="rounded-xl bg-contain bg-bg-background"
                />
              </div>
            )}
            {product.discounted_price && (
              <span className="absolute top-4 right-4 bg-primary text-background px-2 py-1 rounded text-xs font-semibold z-10">
                {Math.round(
                  ((product.price - product.discounted_price) / product.price) *
                    100
                )}
                %
              </span>
            )}
          </div>

          <div className="flex gap-3 overflow-x-auto p-1">
            {images.map((imgId, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(imgId)}
                className={`border rounded overflow-hidden ${
                  selectedImage === imgId ? "ring-2 ring-primary" : ""
                }`}
              >
                <Image
                  src={getImageUrl(imgId)}
                  alt={`Thumbnail ${idx}`}
                  width={80}
                  height={80}
                  className="w-20 h-20 p-2 object-cover bg-background"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Info Panel */}
        <div className="bg-background rounded-xl p-6 shadow-sm border col-span-2 flex flex-col justify-between">
          <div>
            <h1 className="text-2xl font-semibold mb-2">{product.name}</h1>
            <p className="text-sm font-semibold my-1 flex justify-start items-center gap-4">
              {product.status === "in-stock" && (
                <span className="text-green-600 dark:text-green-400 flex items-center gap-1">
                  <CheckCircle size={16} /> In Stock
                </span>
              )}
              {product.status === "out-of-stock" && (
                <span className="text-red-500 flex items-center gap-1">
                  <XCircle size={16} /> Out of Stock
                </span>
              )}
              {product.status === "pre-order" && (
                <span className="text-yellow-500 flex items-center gap-1">
                  <Clock size={16} /> Pre Order
                </span>
              )}

              {product.warranty && (
                <span className="font-bold py-2 bg-primary text-background px-3 rounded-full">
                  {product.warranty} Warranty
                </span>
              )}
            </p>
            {product.discounted_price ? (
              <div className="flex items-center gap-4 my-3">
                <span className="line-through text-gray-400 text-xl font-medium">
                  {product.price}৳
                </span>
                <span className="text-green-600 dark:text-green-400 text-2xl font-bold">
                  {product.discounted_price}৳
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-4 my-3">
                <span className="text-green-600 dark:text-green-400 text-2xl font-bold">
                  {product.price}৳
                </span>
              </div>
            )}

            <p className="text-base  mb-4 text-pretty text-justify">
              {product.short_description ||
                "This is a great product that you will love. It has many features and benefits that make it stand out from the competition."}
            </p>
          </div>

          <div>
            <div className="mb-4 flex items-center gap-2">
              <label className="text-base font-medium ">Quantity:</label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  className="bg-primary hover:secondary text-background hover:text-foreground font-bold py-2 px-3 rounded"
                >
                  <Minus size={16} />
                </button>

                <input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, Number(e.target.value)))
                  }
                  className="w-16 text-center accent-primary border bg-background border-gray-300 py-2 rounded-full text-base font-semibold"
                />

                <button
                  type="button"
                  onClick={() => setQuantity((prev) => prev + 1)}
                  className="bg-primary hover:secondary text-background hover:text-foreground font-bold py-2 px-3 rounded"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <div className="flex gap-4 mb-6">
              <button
                onClick={() =>
                  product.status === "in-stock"
                    ? handleAddToCart()
                    : toast.error("product Not Available")
                }
                className="w-fit px-5 bg-primary hover:bg-secondary text-background hover:text-foreground text-sm py-2 rounded-lg font-semibold transition"
              >
                Add to Cart
              </button>
              <button
                onClick={() =>
                  product.status === "in-stock"
                    ? handleBuyNow()
                    : toast.error("Product Not Available")
                }
                className="w-fit px-5  bg-secondary hover:bg-primary text-foreground hover:text-background text-sm py-2 rounded-lg font-semibold transition"
              >
                Buy Now
              </button>
            </div>

            <div className="flex items-center justify-between mb-2 text-sm ">
              <button
                className={`flex items-center gap-2 font-medium transition ${
                  isWishlisted ? "text-red-500" : "hover:text-primary"
                }`}
                onClick={() => dispatch(toggleWishlist(product))}
              >
                <Heart
                  className="w-4 h-4"
                  fill={isWishlisted ? "red" : "none"}
                />
                {isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
              </button>

              <div className="flex gap-3">
                <Link href="#" className="hover:text-primary">
                  <Facebook size={16} />
                </Link>
                <Link href="#" className="hover:text-primary">
                  <Twitter size={16} />
                </Link>
                <Link href="#" className="hover:text-primary">
                  <X size={16} />
                </Link>
                <Link href="#" className="hover:text-primary">
                  <Linkedin size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ProductTabs
        productDetails={product.description}
        pdfUrl={product.datasheet}
        userManual={product.user_manual}
      />
    </PaddingContainer>
  );
}
