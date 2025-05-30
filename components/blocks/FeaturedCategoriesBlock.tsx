// components/PopularCategories.tsx
"use client";

import { TFeaturedCategoriesBlock } from "@/interfaces";
import Image from "next/image";
import Link from "next/link";
import PaddingContainer from "../common/PaddingContainer";

const FeaturedCategoriesBlock = ({
  block,
}: {
  block: TFeaturedCategoriesBlock;
}) => {
  return (
    <section className="py-12 ">
      <PaddingContainer>
        <h2 className="text-2xl md:text-3xl font-bold mb-8">
          {block.item.header_text || "Featured Categories"}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6  gap-3 md:gap-6">
          {block.item.categories.map((cat) => (
            <Link
              href={`/categories/${cat.categories_id.slug}`}
              key={cat.categories_id.id}
              className="group text-center hover:bg-primary transition-all duration-200 hover:shadow-lg rounded-lg p-2"
            >
              <div className="w-full aspect-square bg-gray-100 overflow-hidden rounded-lg">
                <Image
                  src={`${process.env.NEXT_PUBLIC_ASSETS_URL}${cat.categories_id.image}?width=150&height=150`}
                  alt={`${cat.categories_id.name} image`}
                  width={150}
                  priority
                  height={150}
                  placeholder="blur"
                  blurDataURL={`${process.env.NEXT_PUBLIC_ASSETS_URL}${cat.categories_id.image}?width=10&quality=1`}
                  className="object-cover w-full h-full transition-transform group-hover:scale-105"
                />
              </div>
              <h3 className="mt-4 text-sm md:text-base transition-all duration-200 font-semibold group-hover:text-background  ">
                {cat.categories_id.name}
              </h3>
            </Link>
          ))}
        </div>
      </PaddingContainer>
    </section>
  );
};

export default FeaturedCategoriesBlock;
