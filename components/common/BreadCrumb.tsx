"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import PaddingContainer from "./PaddingContainer";
import { fetchProjects } from "@/store/projectSlice";

export default function BreadcrumbBanner() {
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();
  const segments = pathname.split("/").filter(Boolean);

  const projects = useSelector((state: RootState) => state.projects.items);
  const itemsByCategory = useSelector(
    (state: RootState) => state.products.itemsByCategory
  );

  // Combine all products from all categories
  const allProducts = useMemo(() => {
    return Object.values(itemsByCategory).flat();
  }, [itemsByCategory]);

  // 🔁 Fetch projects only if needed
  useEffect(() => {
    if (segments[0] === "projects" && projects.length === 0) {
      dispatch(fetchProjects());
    }
  }, [segments, projects.length, dispatch]);

  if (pathname === "/" || pathname === "/home") return null;

  const breadcrumb = segments.map((segment, index) => {
    const matchedProduct = allProducts.find((p) => p.slug === segment);
    const matchedCategory = allProducts.find(
      (p) => p.category?.slug === segment
    )?.category;
    const matchedProject = projects.find((proj) => proj.slug === segment);

    const name =
      matchedProduct?.name ||
      matchedCategory?.name ||
      matchedProject?.title ||
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
    <div className="sticky top-[72px] z-40 backdrop-blur-lg bg-backgroundLight/80 dark:bg-backgroundDark/80 transition-all duration-300">
      <PaddingContainer className="relative w-full">
        <nav className="text-xs md:text-sm flex items-center border-t border-b gap-2 py-2 overflow-x-auto">
          <Link href="/" className="hover:underline shrink-0">
            Home
          </Link>
          {breadcrumb.map((item, i) => {
            const isLast = i === breadcrumb.length - 1;
            return (
              <div key={i} className="flex items-center gap-2 shrink-0">
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
  );
}
