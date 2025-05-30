"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import PaddingContainer from "./PaddingContainer";

export default function BreadcrumbBanner() {
  const pathname = usePathname();
  const { items: products } = useSelector((state: RootState) => state.products);

  if (pathname === "/" || pathname === "/home") return null;

  const segments = pathname.split("/").filter(Boolean);

  const breadcrumb = segments.map((segment, index) => {
    // Try to match product
    const matchedProduct = products.find((p) => p.slug === segment);

    // Try to match category by slug from any product
    const matchedCategory = products.find(
      (p) => p.category?.slug === segment
    )?.category;

    // Fallback: prettify the slug
    const name =
      matchedProduct?.name ||
      matchedCategory?.name ||
      decodeURIComponent(segment.replace(/-/g, " ")).replace(/\b\w/g, (char) =>
        char.toUpperCase()
      );

    return {
      name,
      slug: "/" + segments.slice(0, index + 1).join("/"),
    };
  });

  if (breadcrumb.length === 0) return null;

  return (
    <div className="relative w-full overflow-hidden">
      <div className="z-10">
        <PaddingContainer>
          <nav className="text-xs md:text-sm flex items-center border-b gap-2 py-2">
            <Link href="/" className="hover:underline">
              Home
            </Link>
            {breadcrumb.map((item, i) => {
              const isLast = i === breadcrumb.length - 1;
              return (
                <div key={i} className="flex items-center gap-2">
                  <span>&gt;</span>
                  <Link
                    href={item.slug}
                    className={
                      isLast
                        ? "text-primary font-medium line-clamp-1"
                        : "hover:underline line-clamp-1"
                    }
                  >
                    {item.name}
                  </Link>
                </div>
              );
            })}
          </nav>
        </PaddingContainer>
      </div>
    </div>
  );
}
