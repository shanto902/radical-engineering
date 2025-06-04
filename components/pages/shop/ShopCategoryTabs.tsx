"use client";
import { usePathname, useRouter } from "next/navigation";
import { TCategory } from "@/interfaces";
import { isNativeApp } from "@/components/common/isNativeApp"; // adjust path if needed
import Image from "next/image";

export default function CategoryTabs({
  categories,
}: {
  categories: TCategory[];
}) {
  const pathname = usePathname();
  const router = useRouter();
  const categorySlug = pathname?.split("/")[2] || "all";

  if (isNativeApp()) return null;

  return (
    <>
      <div className="md:flex hidden gap-4 pt-3 flex-wrap font-bold mb-3">
        <button
          className={`px-4 py-2 rounded-full ${
            categorySlug === "all"
              ? "bg-primary text-background"
              : "text-foreground"
          }`}
          onClick={() => router.push("/categories/all")}
        >
          All
        </button>
        {categories?.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => router.push(`/categories/${cat.slug}`)}
            className={`px-4 py-2 rounded-full ${
              categorySlug === cat.slug
                ? "bg-primary text-background"
                : "text-foreground"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className="flex md:hidden overflow-x-auto gap-3 pt-3 pb-2 px-2 mb-3 scrollbar-hide">
        <button
          onClick={() => router.push("/categories/all")}
          className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full border ${
            categorySlug === "all"
              ? "bg-primary text-background"
              : "text-foreground"
          }`}
        >
          <span className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs">
            🛒
          </span>
          All
        </button>

        {categories?.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => router.push(`/categories/${cat.slug}`)}
            className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full border ${
              categorySlug === cat.slug
                ? "bg-primary text-background"
                : "text-foreground"
            }`}
          >
            <Image
              src={`${process.env.NEXT_PUBLIC_ASSETS_URL}${cat.image}`}
              alt={cat.name}
              width={24}
              height={24}
              className="rounded-full w-6 h-6 object-contain"
            />
            <span className="text-sm font-medium">{cat.name}</span>
          </button>
        ))}
      </div>
    </>
  );
}
