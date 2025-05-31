"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import Marquee from "react-fast-marquee";
import { TBrand } from "@/interfaces";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
const BrandMarquee = ({ brands }: { brands: TBrand[] }) => {
  const theme = useSelector((state: RootState) => state.theme.mode);
  return (
    <Marquee
      speed={50}
      pauseOnHover={true}
      gradientColor={theme === "light" ? "#ffffff" : "#1f1f1f"}
      gradient={true}
      autoFill={true}
    >
      {brands
        ?.filter((brand) => brand.logo) // ✅ Skip brands without logos
        .map((brand, i) => (
          <div key={i} className="mx-8 cursor-pointer">
            <Link
              href={brand.link}
              target="_blank"
              className="relative w-24 h-24 mx-auto"
            >
              <Image
                className="object-contain aspect-square opacity-80 hover:opacity-100 transition-opacity duration-300"
                src={`${process.env.NEXT_PUBLIC_ASSETS_URL}${brand.logo}?height=96`}
                alt={brand.name}
                height={96}
                width={96}
              />
            </Link>
          </div>
        ))}
    </Marquee>
  );
};

export default BrandMarquee;
