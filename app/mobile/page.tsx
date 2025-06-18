// app/app/page.tsx

import { fetchCategoriesMobile } from "@/helper/fetchFromDirectus";
import Image from "next/image";
import Link from "next/link";

const MobilePage = async () => {
  const categories = await fetchCategoriesMobile();

  return (
    <div className="min-h-screen flex flex-col pb-20">
      {/* 🌀 Category Slider */}
      <div className="px-4 py-2">
        <div className="flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-smooth">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/categories/${cat.slug}`}
              className="snap-center flex-shrink-0 w-28 relative group"
            >
              <div className="w-24 h-24 mx-auto rounded-full p-1 shadow-lg overflow-hidden bg-primary transition-transform group-hover:scale-105">
                <Image
                  src={`${process.env.NEXT_PUBLIC_ASSETS_URL}${cat.image}?width=100&height=100`}
                  alt={cat.name}
                  width={100}
                  height={100}
                  className="object-cover w-full h-full rounded-full"
                  placeholder="blur"
                  blurDataURL={`${process.env.NEXT_PUBLIC_ASSETS_URL}${cat.image}?width=10&quality=1`}
                />
              </div>
              <div className="mt-2 text-center text-xs font-semibold text-foreground truncate">
                {cat.name}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 🔥 Featured Products by Category */}
      <div className="px-4 py-6 space-y-10">
        {categories
          .filter((cat) => cat.products)
          .map((cat) => (
            <div className="relative" key={cat.id}>
              {/* Modern Category Banner */}
              <Link
                href={`/categories/${cat.slug}`}
                className="mb-4 w-full h-[100px] rounded-xl overflow-hidden flex items-center bg-gradient-to-r from-foreground to-muted shadow-md hover:shadow-lg transition duration-300"
              >
                {/* Left: Image */}
                <div className="h-full w-[40%] bg-foreground flex items-center justify-start  ">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_ASSETS_URL}${cat.image}?width=100&height=100`}
                    alt={cat.name}
                    width={100}
                    height={100}
                    className="rounded-full object-contain  p-2 "
                  />
                </div>

                {/* Right: Text + CTA */}
                <div className="h-full w-[60%] relative flex flex-col text-right justify-center items-end p-4 bg-gradient-to-r  from-foreground  via-primary/20 to-primary">
                  <h3 className="text-base font-bold uppercase text-background line-clamp-2">
                    {cat.name}
                  </h3>
                  <span className="mt-1 text-sm text-background font-medium underline underline-offset-4">
                    Shop Now →
                  </span>
                </div>
              </Link>

              {/* Product Grid */}
              <div className="grid grid-cols-2 gap-4">
                {cat.products!.slice(0, 4).map((product) => (
                  <Link
                    key={product.id}
                    href={`/categories/${cat.slug}/${product.slug}`}
                    className="border border-primary rounded-lg p-3 hover:shadow transition bg-background"
                  >
                    <Image
                      src={`${process.env.NEXT_PUBLIC_ASSETS_URL}${product.image}?width=200`}
                      alt={product.name}
                      width={200}
                      height={200}
                      className="w-full aspect-square object-contain bg-white rounded mb-2"
                    />
                    <div className="text-sm font-medium line-clamp-2">
                      {product.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {product.discounted_price ?? product.price} BDT
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default MobilePage;
