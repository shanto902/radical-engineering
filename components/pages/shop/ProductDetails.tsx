"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import InnerImageZoom from "react-inner-image-zoom";

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
} from "lucide-react";
import Link from "next/link";
import { TProduct } from "@/interfaces";
import PaddingContainer from "@/components/common/PaddingContainer";

export default function ProductPage({ product }: { product: TProduct }) {
  // Combine main image and gallery
  const images = [
    product.image,
    ...(product.image_gallery?.map((img) => img.directus_files_id) || []),
  ];

  const [selectedImage, setSelectedImage] = useState(images[0]);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const getImageUrl = (id: string) =>
    `${process.env.NEXT_PUBLIC_ASSETS_URL}${id}`;

  return (
    <PaddingContainer className=" py-20 grid grid-cols-1 md:grid-cols-3 gap-10">
      {/* Left Image Panel */}
      <div>
        {/* Zoomable Image */}
        <div className="relative border mx-auto  rounded-xl mb-4 bg-white overflow-hidden">
          {hasMounted && (
            <div key={selectedImage} className="w-full ">
              <InnerImageZoom
                key={selectedImage}
                height={500}
                width={1000}
                src={getImageUrl(selectedImage)}
                zoomSrc={getImageUrl(selectedImage)}
                zoomType="hover"
                zoomPreload
                className="rounded-xl bg-contain  w-full bg-white"
              />
            </div>
          )}

          <span className="absolute top-4 right-4 bg-primary text-white px-2 py-1 rounded text-xs font-semibold z-10">
            {product.discounted_price
              ? `-${Math.round(
                  ((product.price - product.discounted_price) / product.price) *
                    100
                )}%`
              : "New"}
          </span>
        </div>

        {/* Thumbnails */}
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
                className="w-20 h-20 object-cover bg-white"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Right Info Panel */}
      <div className="bg-white rounded-xl p-6 shadow-sm border col-span-2">
        <h1 className="text-2xl font-semibold mb-2">{product.name}</h1>

        <div className="flex items-center gap-4 mb-4">
          <span className="line-through text-gray-400 text-lg font-medium">
            {product.price}৳
          </span>
          <span className="text-green-600 text-2xl font-bold">
            {product.discounted_price}৳
          </span>

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
        </div>

        <ul className="text-sm text-gray-700 mb-6 space-y-1 list-disc list-inside">
          <li>Back up Battery</li>
          <li>Volt: 12 Volt</li>
          <li>Amp: 7.5 Amp</li>
          <li>Good Quality</li>
        </ul>

        <div className="flex gap-4 mb-6">
          <button className="flex-1 bg-primary text-white hover:bg-yellow-300 hover:text-black transition font-semibold py-2 rounded-xl">
            Add to Cart
          </button>
          <button className="flex-1 border border-primary text-primary hover:bg-primary hover:text-white transition font-semibold py-2 rounded-xl">
            Buy Now
          </button>
        </div>

        <div className="flex items-center justify-between mb-2 text-sm text-gray-600">
          <button className="flex items-center gap-2 hover:text-primary font-medium">
            <Heart className="w-4 h-4" />
            Add to wishlist
          </button>
          <div className="flex gap-3">
            <Link href="#" className="hover:text-blue-500">
              <Facebook size={16} />
            </Link>
            <Link href="#" className="hover:text-sky-400">
              <Twitter size={16} />
            </Link>
            <Link href="#" className="hover:text-black">
              <X size={16} />
            </Link>
            <Link href="#" className="hover:text-blue-600">
              <Linkedin size={16} />
            </Link>
          </div>
        </div>
      </div>
    </PaddingContainer>
  );
}
